// probe.gl, MIT license

import type {Bench} from '@probe.gl/bench';

// TODO - dummy benchmark - should replace with log related benchmark
const arr = [1, 1, 1, 1];

const someFn = i => ((((i * 3 * 8) / 1200) * 0.002) / 40) * 0.2;

let sumForEach = 0;
let sumMap = 0;
let sumFor = 0;

export default function addBenchmarks(suite: Bench, addReferenceBenchmarks: boolean): Bench {
  suite
    .group('Javascript Array benchmark')
    .add('Array.forEach', () => arr.forEach(item => (sumForEach += someFn(item))))
    .add('Array.reduce', () => arr.reduce((sumReduce, item) => (sumReduce += someFn(item)), 0))
    .add('Array.map', () => arr.map(item => (sumMap += someFn(item))))
    .add('For loop', () => {
      for (let j = 0; j < arr.length; j++) {
        sumFor = sumFor + someFn(arr[j]);
      }
    });

  return suite;
}
