/* eslint-disable no-console */
/* global console */
import {formatSI} from './utils/formatters';
import {autobind} from './utils/autobind';
// import LocalStorage from './utils/local-storage';
import assert from 'assert';

export default class Bench {
  constructor({log = console.log.bind(console)} = {}) {
    this.log = log;
    this.timer = null;
    this.results = {};
    autobind(this);
    Object.seal(this);
  }

  calibrate(id, func1, func2, opts) {
    this.add(id, func1, func2, opts);
    return this;
  }

  run() {
    return this;
  }

  group(id) {
    this.log('');
    this.log(`### ${id}`);
    return this;
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

    const testArgs = initFunc && initFunc();
    const {time, iterationsPerSecond} = runTest({testFunc, testArgs, context});
    this.log(`${id}: ${formatSI(iterationsPerSecond)} iterations/s (${time.toFixed(2)}s)`);

    this.results[id] = iterationsPerSecond;

    return this;
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
