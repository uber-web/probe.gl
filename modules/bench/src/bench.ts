/* eslint-disable no-console */
import {autobind, LocalStorage, getHiResTimestamp} from '@probe.gl/log';
import {formatSI} from './format-utils';
import {mean, cv} from './stat-utils';
import {logResultsAsMarkdownTable, logResultsAsTree} from './bench-loggers';

const noop = () => {};

const TIME_THRESHOLD_MS = 80; // Minimum number of milliseconds to iterate each bench test
const TIME_COOLDOWN_MS = 5; // milliseconds of "cooldown" between tests
const MIN_ITERATIONS = 3; // Increase if OK to let slow benchmarks take long time

export const LOG_ENTRY = {
  GROUP: 'group',
  TEST: 'test',
  COMPLETE: 'complete'
};

function assert(condition: unknown, message?: string) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

export type BenchOptions = {
  id?: string;
  log?: any;
  time?: number;
  delay?: number;
  minIterations?: number;
};

export default class Bench {
  id: string;
  opts: Required<BenchOptions>;
  tests = {};
  results = {};
  table = {};

  constructor(options: BenchOptions = {}) {
    const {
      id = '', // Name is needed for regression (storing/loading)
      log = null,
      time = TIME_THRESHOLD_MS,
      delay = TIME_COOLDOWN_MS,
      minIterations = MIN_ITERATIONS
    } = options;

    let logger = log;
    if (!logger) {
      const markdown = globalThis.probe && globalThis.probe.markdown;
      logger = markdown ? logResultsAsMarkdownTable : logResultsAsTree;
    }

    this.id = id;
    this.opts = {id, log: logger, time, delay, minIterations};
    autobind(this);
    Object.seal(this);
  }

  calibrate(id?, func1?, func2?, opts?): this {
    return this;
  }

  async run(): Promise<void> {
    const timeStart = getHiResTimestamp();

    // eslint-disable-next-line @typescript-eslint/unbound-method
    const {tests, onBenchmarkComplete} = this;
    // @ts-expect-error
    await runTests({tests, onBenchmarkComplete});

    const elapsed = (getHiResTimestamp() - timeStart) / 1000;
    logEntry(this, {entry: LOG_ENTRY.COMPLETE, time: elapsed, message: 'Complete'});
    this.onSuiteComplete();
  }

  group(id): this {
    assert(!this.tests[id], 'tests need unique id strings');
    this.tests[id] = {id, group: true, opts: this.opts};
    return this;
  }

  add(priority, id, func1, func2): this {
    this._add(priority, id, func1, func2);
    return this;
  }

  // Mark test as async (returns promise)
  addAsync(priority, id, func1, func2): this {
    const test = this._add(priority, id, func1, func2);
    test.async = true;
    return this;
  }

  onBenchmarkComplete({id, time, iterations, itersPerSecond}): void {
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

  onSuiteComplete(): void {
    const localStorage = new LocalStorage(this.id);
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

  // Signatures:
  //  add(id, {...options}, testFunc)
  //  add(id, testFunc)
  // Deprecated signatures
  //  add(priority, id, testFunc)
  //  add(priority, id, initFunc, testFunc)
  //  add(id, initFunc, testFunc)

  _add(priority, id, func1, func2) {
    let options = {};

    if (typeof priority === 'number') {
      console.warn('`priority` argument is deprecated, use `options.priority` instead');
    }

    if (typeof priority === 'string' && typeof id === 'object') {
      options = id;
      id = priority;
      priority = 0;
    } else if (typeof priority === 'string') {
      func2 = func1;
      func1 = id;
      id = priority;
      priority = 0;
    }

    assert(typeof id === 'string');
    assert(typeof func1 === 'function');

    // @ts-expect-error
    let initFunc = options.initialize;
    let testFunc = func1;
    if (typeof func2 === 'function') {
      console.warn('`initFunc` argument is deprecated, use `options.initialize` instead');
      initFunc = func1;
      testFunc = func2;
    }

    // Test case options
    const opts = {
      ...this.opts,
      multiplier: 1, // multiplier per test case
      unit: '',
      ...options
    };

    assert(!this.tests[id], 'tests need unique id strings');
    this.tests[id] = {
      id,
      priority,
      initFunc,
      testFunc,
      opts
    };
    return this.tests[id];
  }
}

// Helper methods

// Helper function to promisify setTimeout
function addDelay(timeout): Promise<void> {
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
  const priority = (globalThis.probe && globalThis.probe.priority) | 10;
  if ((opts.priority | 0) <= priority) {
    opts = {...test, ...test.opts, ...opts, id: test.id};
    delete opts.opts;
    test.opts.log(opts);
  }
}

// Run a list of bench test case asynchronously (with short timeouts inbetween)
async function runTests({tests, onBenchmarkComplete = noop}) {
  // Run default warm up and calibration tests
  // @ts-expect-error
  runCalibrationTests({tests, onBenchmarkComplete});

  // Run the suite tests
  for (const id in tests) {
    const test = tests[id];
    if (test.group) {
      logEntry(test, {entry: LOG_ENTRY.GROUP, message: test.id});
    } else {
      await runTest({test, onBenchmarkComplete});
    }
  }
}

async function runTest({test, onBenchmarkComplete, silent = false}) {
  // Inject a small delay between each test. System cools and DOM console updates...
  await addDelay(test.opts.delay);

  const result = await runBenchTestAsync(test);

  const {iterationsPerSecond, time, iterations, error} = result;

  const itersPerSecond = formatSI(iterationsPerSecond);

  if (!silent) {
    logEntry(test, {
      entry: LOG_ENTRY.TEST,
      itersPerSecond,
      time,
      error,
      message: `${test.id} ${itersPerSecond} ${test.opts.unit}/s ±${(error * 100).toFixed(2)}%`
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

// Test runners

async function runBenchTestAsync(test) {
  const results = [];
  let totalTime = 0;
  let totalIterations = 0;

  for (let i = 0; i < test.opts.minIterations; i++) {
    let time;
    let iterations;
    // Runs "test._throughput" parallel test cases
    if (test.async && test.opts._throughput) {
      const {_throughput} = test.opts;
      ({time, iterations} = await runBenchTestParallelIterationsAsync(test, _throughput));
    } else {
      ({time, iterations} = await runBenchTestForMinimumTimeAsync(test, test.opts.time));
    }

    // Test options can have `multiplier` to return a more semantic number
    // (e.g. number of bytes, lines, points or pixels decoded per iteration)
    iterations *= test.opts.multiplier;

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
async function runBenchTestForMinimumTimeAsync(test, minTime) {
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
    if (test.async) {
      await runBenchTestIterationsAsync(test, iterations);
    } else {
      runBenchTestIterations(test, iterations);
    }
    elapsedMillis = getHiResTimestamp() - timeStart;
  }

  const time = elapsedMillis / 1000;

  return {
    time,
    iterations
  };
}

// Run a test func for a specific amount of parallel iterations
async function runBenchTestParallelIterationsAsync(test, iterations) {
  const testArgs = test.initFunc && test.initFunc();

  const timeStart = getHiResTimestamp();

  const promises = [];

  const {context, testFunc} = test;
  for (let i = 0; i < iterations; i++) {
    promises.push(testFunc.call(context, testArgs));
  }

  await Promise.all(promises);

  const time = (getHiResTimestamp() - timeStart) / 1000;

  return {
    time,
    iterations
  };
}

// Run a test func for a specific amount of iterations
async function runBenchTestIterationsAsync(test, iterations) {
  const testArgs = test.initFunc && test.initFunc();
  const {context, testFunc} = test;
  for (let i = 0; i < iterations; i++) {
    await testFunc.call(context, testArgs);
  }
}

// Sync tests

// Run a test func for a specific amount of iterations
function runBenchTestIterations(test, iterations) {
  const testArgs = test.initFunc && test.initFunc();

  // When running sync, avoid overhead of parameter passing if not needed
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
