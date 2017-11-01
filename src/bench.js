/* eslint-disable no-console */
/* global console */
import {formatSI} from './utils/formatters';
import {autobind} from './utils/autobind';
// import LocalStorage from './utils/local-storage';
import assert from 'assert';

export default class Bench {
  constructor({
    timeouts = true,
    log = console.log.bind(console)
  } = {}) {
    this.log = log;
    this.timeouts = timeouts;
    this.tests = {};
    this.results = {};
    autobind(this);
    Object.seal(this);
  }

  calibrate(id, func1, func2, opts) {
    this.add(id, func1, func2, opts);
    return this;
  }

  run() {
    if (this.timeouts) {
      return this._runAsyncTests();
    }
    for (const bench of this.tests) {
      bench();
    }
    return Promise.resolve(true);
  }

  group(id) {
    const bench = () => {
      this.log('');
      this.log(`${id}`);
    };

    return this._addTest(id, bench);
  }

  add(id, func1, func2, opts) {
    const {context = {}} = {};
    assert(id);
    assert(typeof func1 === 'function');

    let initFunc = null;
    let testFunc = func1;
    if (typeof func2 === 'function') {
      initFunc = func1;
      testFunc = func2;
    }

    const bench = () => {
      const testArgs = initFunc && initFunc();
      const {time, iterationsPerSecond} = runTest({testFunc, testArgs, context});
      this.log(`├─ ${id}: ${formatSI(iterationsPerSecond)} iterations/s (${time.toFixed(2)}s)`);
      this.results[id] = iterationsPerSecond;
    };

    return this._addTest(id, bench);
  }

  _addTest(id, bench) {
    assert(!this.tests[id], 'tests need unique id strings');
    this.tests[id] = bench;
    return this;
  }

  _runAsyncTests() {
    let promise = Promise.resolve(true);
    for (const id in this.tests) {
      const bench = this.tests[id];
      promise = promise.then(() => this._runAsyncTest(bench));
    }
    return promise;
  }

  _runAsyncTest(bench) {
    return new Promise(resolve => {
      /* global setTimeout */
      setTimeout(() => {
        try {
          bench();
        } finally {
          resolve(true);
        }
      }, 100); // small timeout to let system cool...
    });
  }
}

// Helper methods

function runTestOnce({testFunc, testArgs, context, iterations}) {
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

function runTest({testFunc, testArgs, context}) {
  let iterations = 0.1;
  let elapsedMillis = 0;

  // Run for at least 100ms
  while (elapsedMillis < 100) {
    iterations *= 10;
    const timer = new Date();
    runTestOnce({testFunc, testArgs, context, iterations});
    elapsedMillis = new Date() - timer;
  }

  return {
    time: elapsedMillis / 1000,
    iterations,
    iterationsPerSecond: iterations * 1000 / elapsedMillis
  };
}
