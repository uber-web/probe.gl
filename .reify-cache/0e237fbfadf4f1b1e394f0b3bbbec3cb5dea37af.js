"use strict";module.export({default:()=>Bench});module.export({LOG_ENTRY:()=>LOG_ENTRY},true);var global,assert,autobind,LocalStorage,getHiResTimestamp;module.link('probe.gl',{global(v){global=v},assert(v){assert=v},autobind(v){autobind=v},LocalStorage(v){LocalStorage=v},getHiResTimestamp(v){getHiResTimestamp=v}},0);var formatSI;module.link('./format-utils',{formatSI(v){formatSI=v}},1);var mean,cv;module.link('./stat-utils',{mean(v){mean=v},cv(v){cv=v}},2);var logResultsAsMarkdownTable,logResultsAsTree;module.link('./bench-loggers',{logResultsAsMarkdownTable(v){logResultsAsMarkdownTable=v},logResultsAsTree(v){logResultsAsTree=v}},3);/* eslint-disable no-console */
/* global setTimeout, console */





const noop = () => {};

const TIME_THRESHOLD_MS = 80; // Minimum number of milliseconds to iterate each bench test
const TIME_COOLDOWN_MS = 5; // milliseconds of "cooldown" between tests
const MIN_ITERATIONS = 3; // Increase if OK to let slow benchmarks take long time

const LOG_ENTRY = {
  GROUP: 'group',
  TEST: 'test',
  COMPLETE: 'complete'
};

class Bench {
  constructor({
    id, // Name is needed for regression (storing/loading)
    log,
    time = TIME_THRESHOLD_MS,
    delay = TIME_COOLDOWN_MS,
    minIterations = MIN_ITERATIONS
  } = {}) {
    if (!log) {
      const markdown = global.probe && global.probe.markdown;
      log = markdown ? logResultsAsMarkdownTable : logResultsAsTree;
    }

    this.id = id;
    this.opts = {log, time, delay, minIterations};
    this.tests = {};
    this.results = {};
    this.table = {};
    autobind(this);
    Object.seal(this);
  }

  calibrate(id, func1, func2, opts) {
    return this;
  }

  run() {
    const timeStart = getHiResTimestamp();

    const {tests, onBenchmarkComplete} = this;
    const promise = runTests({tests, onBenchmarkComplete});

    promise.then(() => {
      const elapsed = (getHiResTimestamp() - timeStart) / 1000;
      logEntry(this, {entry: LOG_ENTRY.COMPLETE, time: elapsed, message: 'Complete'});
      this.onSuiteComplete();
    });

    return promise;
  }

  group(id) {
    assert(!this.tests[id], 'tests need unique id strings');
    this.tests[id] = {id, group: true, opts: this.opts};
    return this;
  }

  // Signatures:
  // add(priority, id, initFunc, testFunc)
  // add(priority, id, testFunc)
  // add(id, initFunc, testFunc)
  // add(id, testFunc)
  add(priority, id, func1, func2) {
    this._add(priority, id, func1, func2);
    return this;
  }

  // Mark test as async (returns promise)
  addAsync(priority, id, func1, func2) {
    const test = this._add(priority, id, func1, func2);
    test.async = true;
    return this;
  }

  onBenchmarkComplete({id, time, iterations, itersPerSecond}) {
    // calculate iterations per second, save as numeric value
    const current = Math.round(iterations / time);
    // Format as human readable strings
    this.table[id] = {
      percent: '',
      iterations: `${itersPerSecond}/s`,
      current,
      max: ''
    };
  }

  onSuiteComplete() {
    const localStorage = new LocalStorage({id: this.id});
    const saved = localStorage.getConfiguration();
    const current = this.updateTable(this.table, saved);
    localStorage.updateConfiguration(current);
    console.table(current);
  }

  updateTable(current, saved) {
    for (const id in this.table) {
      if (saved[id] && saved[id].max !== undefined) {
        current[id].max = Math.max(current[id].current, saved[id].max);
        const delta = current[id].current / saved[id].max;
        current[id].percent = `${Math.round(delta * 100 - 100)}%`;
      } else {
        current[id].max = current[id].current;
      }
    }
    return current;
  }

  _add(priority, id, func1, func2) {
    if (typeof priority === 'string') {
      func2 = func1;
      func1 = id;
      id = priority;
      priority = 0;
    }

    assert(id);
    assert(typeof func1 === 'function');

    let initFunc = null;
    let testFunc = func1;
    if (typeof func2 === 'function') {
      initFunc = func1;
      testFunc = func2;
    }

    assert(!this.tests[id], 'tests need unique id strings');
    this.tests[id] = {id, priority, initFunc, testFunc, opts: this.opts};
    return this.tests[id];
  }
}

// Helper methods

// Helper function to promisify setTimeout
function addDelay(timeout, func) {
  return new Promise(resolve => {
    setTimeout(() => resolve(), timeout);
  });
}

function runCalibrationTests({tests}) {
  // Beat JIT - run each test once
  for (const id in tests) {
    const test = tests[id];
    if (!test.group) {
      runBenchTestIterations(test, 1);
    }
  }
}

function logEntry(test, opts) {
  const priority = (global.probe && global.probe.priority) | 10;
  if ((opts.priority | 0) <= priority) {
    test.opts.log(opts);
  }
}

// Run a list of bench test case asynchronously (with short timeouts inbetween)
async function runTests({tests, onBenchmarkComplete = noop}) {
  // Run default warm up and calibration tests
  runCalibrationTests({tests, onBenchmarkComplete});

  // Run the suite tests
  for (const id in tests) {
    const test = tests[id];
    if (test.group) {
      logEntry(test, {entry: LOG_ENTRY.GROUP, id: test.id, message: test.id});
    } else {
      await runTest({test, onBenchmarkComplete});
    }
  }
}

async function runTest({test, onBenchmarkComplete, silent = false}) {
  // Inject a small delay between each test. System cools and DOM console updates...
  await addDelay(test.opts.delay);

  const result = test.async ? await runBenchTestAsync(test) : runBenchTest(test);

  const {iterationsPerSecond, time, iterations, error} = result;

  const itersPerSecond = formatSI(iterationsPerSecond);
  if (!silent) {
    logEntry(test, {
      entry: LOG_ENTRY.TEST,
      id: test.id,
      priority: test.priority,
      itersPerSecond,
      time,
      error,
      message: `${test.id} ${itersPerSecond}/s ±${(error * 100).toFixed(2)}%`
    });
  }

  if (onBenchmarkComplete) {
    onBenchmarkComplete({
      id: test.id,
      time,
      iterations,
      iterationsPerSecond,
      itersPerSecond
    });
  }
}

// Sync tests

function runBenchTest(test) {
  const results = [];
  let totalTime = 0;
  let totalIterations = 0;

  for (let i = 0; i < test.opts.minIterations; i++) {
    const {time, iterations} = runBenchTestTimed(test, test.opts.time);
    const iterationsPerSecond = iterations / time;
    results.push(iterationsPerSecond);
    totalTime += time;
    totalIterations += iterations;
  }

  return {
    time: totalTime,
    iterations: totalIterations,
    iterationsPerSecond: mean(results),
    error: cv(results)
  };
}

// Run a test func for an increasing amount of iterations until time threshold exceeded
function runBenchTestTimed(test, minTime) {
  let iterations = 1;
  let elapsedMillis = 0;

  // Run increasing amount of interations until we reach time threshold, default at least 100ms
  while (elapsedMillis < minTime) {
    let multiplier = 10;
    if (elapsedMillis > 10) {
      multiplier = (test.opts.time / elapsedMillis) * 1.25;
    }
    iterations *= multiplier;
    const timeStart = getHiResTimestamp();
    runBenchTestIterations(test, iterations);
    elapsedMillis = getHiResTimestamp() - timeStart;
  }

  const time = elapsedMillis / 1000;

  return {time, iterations};
}

// Run a test func for a specific amount of iterations
function runBenchTestIterations(test, iterations) {
  const testArgs = test.initFunc && test.initFunc();

  const {context, testFunc} = test;
  if (context && testArgs) {
    for (let i = 0; i < iterations; i++) {
      testFunc.call(context, testArgs);
    }
  } else {
    for (let i = 0; i < iterations; i++) {
      testFunc.call(context);
    }
  }
}

// ASYNC TESTS
// This path is duplicated to minimize overhead in the sync case
// TODO - increase code sharing between paths

async function runBenchTestAsync(test) {
  const results = [];
  let totalTime = 0;
  let totalIterations = 0;

  for (let i = 0; i < test.opts.minIterations; i++) {
    const {time, iterations} = await runBenchTestTimedAsync(test, test.opts.time);
    const iterationsPerSecond = iterations / time;
    results.push(iterationsPerSecond);
    totalTime += time;
    totalIterations += iterations;
  }

  return {
    time: totalTime,
    iterations: totalIterations,
    iterationsPerSecond: mean(results),
    error: cv(results)
  };
}

// Run a test func for an increasing amount of iterations until time threshold exceeded
async function runBenchTestTimedAsync(test, minTime) {
  let iterations = 1;
  let elapsedMillis = 0;

  // Run increasing amount of interations until we reach time threshold, default at least 100ms
  while (elapsedMillis < minTime) {
    let multiplier = 10;
    if (elapsedMillis > 10) {
      multiplier = (test.opts.time / elapsedMillis) * 1.25;
    }
    iterations *= multiplier;
    const timeStart = getHiResTimestamp();
    await runBenchTestIterationsAsync(test, iterations);
    elapsedMillis = getHiResTimestamp() - timeStart;
  }

  const time = elapsedMillis / 1000;

  return {time, iterations};
}

// Run a test func for a specific amount of iterations
async function runBenchTestIterationsAsync(test, iterations) {
  const testArgs = test.initFunc && test.initFunc();

  const {context, testFunc} = test;
  if (context && testArgs) {
    for (let i = 0; i < iterations; i++) {
      await testFunc.call(context, testArgs);
    }
  } else {
    for (let i = 0; i < iterations; i++) {
      await testFunc.call(context);
    }
  }
}
