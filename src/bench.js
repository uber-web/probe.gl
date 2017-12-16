/* eslint-disable no-console */
/* global setTimeout, console */
import {formatSI} from './utils/formatters';
import {autobind} from './utils/autobind';
import LocalStorage from './utils/local-storage';
import assert from 'assert';

const noop = () => {};

const TIME_THRESHOLD_MS = 30; // Minimum number of milliseconds to iterate each bench test
const TIME_COOLDOWN_MS = 5; // milliseconds of "cooldown" between tests

const CALIBRATION_TESTS = [
  {
    id: 'warmup',
    initFunc: noop,
    testFunc: () => 100,
    opts: {}
  }
];

export default class Bench {
  constructor({
    id, // Name is needed for regression (storing/loading)
    log = console.log.bind(console),
    time = TIME_THRESHOLD_MS,
    delay = TIME_COOLDOWN_MS
  } = {}) {
    this.id = id;
    this.opts = {log, time, delay};
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
    const timer = new Date();

    const {tests, onBenchmarkComplete} = this;
    const promise = runAsyncTests({tests, onBenchmarkComplete});

    promise.then(() => {
      const elapsed = (new Date() - timer) / 1000;
      this.opts.log('');
      this.opts.log(`Completed benchmark in ${elapsed}s`);

      this.onSuiteComplete();
    });

    return promise;
  }

  group(id) {
    assert(!this.tests[id], 'tests need unique id strings');
    this.tests[id] = {id, group: true, opts: this.opts};
    return this;
  }

  add(id, func1, func2, opts) {
    assert(id);
    assert(typeof func1 === 'function');

    let initFunc = null;
    let testFunc = func1;
    if (typeof func2 === 'function') {
      initFunc = func1;
      testFunc = func2;
    }

    assert(!this.tests[id], 'tests need unique id strings');
    this.tests[id] = {id, initFunc, testFunc, opts: this.opts};
    return this;
  }

  onBenchmarkComplete({id, time, iterations, iterationsPerSecond, itersPerSecond}) {
    this.results[id] = {time, iterations, iterationsPerSecond};
    this.table[id] = {
      value: Math.round(iterationsPerSecond),
      itersPerSecond
    };
  }

  onSuiteComplete() {
    let localStorage;
    try {
      localStorage = new LocalStorage();
    } catch (error) {
      // Local Storage not available
      console.error(error);
    }

    if (localStorage) {
      const saved = localStorage.getObject(this.id);
      const current = this.updateTable(this.table, saved);
      localStorage.setObject(this.id, current);
      console.table(current);
    }
  }

  updateTable(current, saved) {
    for (const id in this.table) {
      if (saved[id].max !== undefined) {
        current[id].max = Math.max(current[id].value, saved[id].max);
        const delta = current[id].value / saved[id].max;
        current[id].percent = Math.round(delta * 100);
      } else {
        current[id].max = current[id].value;
      }
    }
    return current;
  }
}

// Helper methods

function runCalibrationTests({tests}) {
  let promise = Promise.resolve(true);

  // Run default warm up and calibration tests
  for (const test of CALIBRATION_TESTS) {
    promise = promise.then(() => runAsyncTest({test, silent: true}));
  }

  return promise;
}

// Run a list of bench test case async
function runAsyncTests({tests, onBenchmarkComplete = noop}) {
  // Run default warm up and calibration tests
  let promise = runCalibrationTests({tests, onBenchmarkComplete});

  // Run the suite tests
  for (const id in tests) {
    const test = tests[id];
    promise = promise.then(() => runAsyncTest({test, onBenchmarkComplete}));
  }
  return promise;
}

function runAsyncTest({test, onBenchmarkComplete, silent = false}) {
  return new Promise(resolve => {
    setTimeout(() => {
      try {
        if (test.group) {
          test.opts.log('');
          test.opts.log(`${test.id}`);
        } else {
          const {time, iterations} = runBenchTest(test);

          const iterationsPerSecond = iterations / time;
          const itersPerSecond = formatSI(iterationsPerSecond);
          if (!silent) {
            test.opts.log(
              `├─ ${test.id}: ${itersPerSecond} iterations/s (${time.toFixed(2)}s elapsed)`);
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
      } finally {
        resolve(true);
      }
    }, test.opts.delay); // small delay between each test. System cools and DOM console updates...
  });
}

// Run a test func for an increasing amount of iterations until time threshold exceeded
function runBenchTest(test) {
  let iterations = 0.1;
  let elapsedMillis = 0;

  // Run increasing amount of interations until we reach time threshold, default at least 100ms
  while (elapsedMillis < test.opts.time) {
    let multiplier = 10;
    if (elapsedMillis > 1) {
      multiplier = (test.opts.time / elapsedMillis) * 1.1;
    }
    iterations *= multiplier;
    const timer = new Date();
    runBenchTestIterations(test, iterations);
    elapsedMillis = new Date() - timer;
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

