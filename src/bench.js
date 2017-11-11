/* eslint-disable no-console */
/* global setTimeout, console */
import {formatSI} from './utils/formatters';
import {autobind} from './utils/autobind';
// import LocalStorage from './utils/local-storage';
import assert from 'assert';

const TIME_THRESHOLD_MS = 100; // Minimum number of milliseconds to iterate each bench test

export default class Bench {
  constructor({
    log = console.log.bind(console),
    delay = 50 // milliseconds of "cooldown" between tests
  } = {}) {
    this.opts = {log, delay};
    this.tests = {};
    this.results = {};
    autobind(this);
    Object.seal(this);
  }

  calibrate(id, func1, func2, opts) {
    return this;
  }

  run() {
    return runAsyncTests(this.tests, this.results);
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
}

// Helper methods

// Run a list of bench test case async
function runAsyncTests(tests, results) {
  let promise = Promise.resolve(true);
  for (const id in tests) {
    const test = tests[id];
    promise = promise.then(() => runAsyncTest(test, results));
  }
  return promise;
}

function runAsyncTest(test, results) {
  return new Promise(resolve => {
    setTimeout(() => {
      try {
        if (test.group) {
          test.opts.log('');
          test.opts.log(`${test.id}`);
        } else {
          runBenchTest(test, results);
        }
      } finally {
        resolve(true);
      }
    }, test.opts.delay); // small delay between each test to let system cool...
  });
}

// Run a test func for an increasing amount of iterations until time threshold exceeded
function runBenchTest(test, results) {
  let iterations = 0.1;
  let elapsedMillis = 0;

  // Run increasing amount of interations until we reach time threshold, default at least 100ms
  while (elapsedMillis < TIME_THRESHOLD_MS) {
    iterations *= 10;
    const timer = new Date();
    runBenchTestIterations(test, iterations);
    elapsedMillis = new Date() - timer;
  }

  const time = elapsedMillis / 1000;
  const iterationsPerSecond = iterations / time;

  test.opts.log(
    `├─ ${test.id}: ${formatSI(iterationsPerSecond)} iterations/s (${time.toFixed(2)}s)`);

  results[test.id] = {time, iterations, iterationsPerSecond};
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

