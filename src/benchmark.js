import d3 from 'd3-format';

export {almostEqual} from '../src/cartography/geometry/geo-utils';

const formatSI = d3.format('.3s');

export const ITERATIONS_XLO = 500;
export const ITERATIONS_LO = 1000;
export const ITERATIONS = 10000;
export const ITERATIONS_HI = 100000;
export const ITERATIONS_UH = 1000000;
export const ITERATIONS_XUH = 5000000;

let timer;

export function startTimer() {
  timer = new Date();
}

export function logIterations(t, testName, iterations = ITERATIONS,
  func, context) {
  if (func) {
    timer = new Date();
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
  const elapsedMillis = new Date() - timer;
  const iterationsPerSecond = formatSI(iterations * 1000 / elapsedMillis);
  t.comment(`${testName}: ${iterationsPerSecond} iterations/s`);
}
