const LENGTH = 1000000;
const ARRAY = new Array(LENGTH).fill(0).map((_, i) => i);

async function* asyncIterator(array) {
  for (const element of array) {
    yield element;
  }
}

export default function coreBench(bench) {
  return bench
    .group('Core Module - Async Iteration')
    .add('Normal Iteration 1M', () => {
      let sum = 0;
      for (const element of ARRAY) {
        sum += element;
      }
      return sum;
    })
    .addAsync('Async Iteration 1M', async () => {
      let sum = 0;
      for await (const element of asyncIterator(ARRAY)) {
        sum += element;
      }
      return sum;
    });
}
