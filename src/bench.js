/* eslint-disable no-console */
/* global console */
import {formatSI} from './utils/formatters';
import {autobind} from './utils/autobind';
import assert from 'assert';

export const ITERATIONS_XLO = 500;
export const ITERATIONS_LO = 1000;
export const ITERATIONS = 10000;
export const ITERATIONS_HI = 100000;
export const ITERATIONS_UH = 1000000;
export const ITERATIONS_XUH = 5000000;

export default class Bench {
  constructor() {
    this.timer = null;
    autobind(this);
    Object.seal(this);
  }

  calibrate() {}

  run() {}

  add({id, iterations = ITERATIONS, func, context, log = console.log}) {
    assert(id);
    if (func) {
      this.timer = new Date();
      if (context) {
        for (let i = 0; i < iterations; i++) {
          func.call(context);
        }
      } else {
        for (let i = 0; i < iterations; i++) {
          func();
        }
      }
    }
    const elapsedMillis = new Date() - this.timer;
    const iterationsPerSecond = formatSI(iterations * 1000 / elapsedMillis);
    log(`${id}: ${iterationsPerSecond} iterations/s`);
  }

  // Internal?

  startTimer() {
    this.timer = new Date();
  }
}
