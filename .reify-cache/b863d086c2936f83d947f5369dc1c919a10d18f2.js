"use strict";module.export({mean:()=>mean,std:()=>std,cv:()=>cv});// mean
function mean(numbers) {
  return numbers.reduce((sum, x) => sum + x, 0) / numbers.length;
}

// standard deviation
function std(numbers, _mean) {
  if (numbers.length <= 1) {
    return 0;
  }

  if (_mean === undefined) {
    _mean = mean(numbers);
  }
  return Math.sqrt(
    numbers.reduce((d, x) => d + (x - _mean) * (x - _mean), 0) / (numbers.length - 1)
  );
}

// coefficient of variation
function cv(numbers) {
  const _mean = mean(numbers);
  const _std = std(numbers, _mean);
  return _std / _mean;
}
