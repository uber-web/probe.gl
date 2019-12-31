const LENGTH = 1000000;

const ARRAY = new Array(LENGTH).fill(0).map((_, i) => i);

function* iterator(length) {
  for (let i = 0; i < length; i++) {
    yield i;
  }
}

async function* asyncIterator(length) {
  for (let i = 0; i < length; i++) {
    yield i;
  }
}

export default function coreBench(bench) {
  return bench
    .group('Core Module - Async Iteration')
    .add('for (let i=0; ...)', {multiplier: LENGTH}, () => {
      let sum = 0;
      for (let i = 0; i < LENGTH; i++) {
        sum += i;
      }
      return sum;
    })
    .add('for (const element of ARRAY)', {multiplier: LENGTH}, () => {
      let sum = 0;
      for (const element of ARRAY) {
        sum += element;
      }
      return sum;
    })
    .add('for (const element of iterator)', {multiplier: LENGTH}, () => {
      let sum = 0;
      for (const element of iterator(LENGTH)) {
        sum += element;
      }
      return sum;
    })
    .addAsync('for await (const element of asyncIterator)', {multiplier: LENGTH}, async () => {
      let sum = 0;
      for await (const element of asyncIterator(ARRAY)) {
        sum += element;
      }
      return sum;
    })
    .addAsync('parallel wait for 1000 promises', {_throughput: LENGTH}, async () => {
      return await 1;
    });
}
