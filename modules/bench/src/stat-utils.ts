// probe.gl, MIT license

/** mean */
export function mean(numbers: number[]): number {
  return numbers.reduce((sum, x) => sum + x, 0) / numbers.length;
}

/** standard deviation */
export function std(numbers: number[], _mean?: number): number {
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

/** coefficient of variation */
export function cv(numbers: number[]): number {
  const _mean = mean(numbers);
  const _std = std(numbers, _mean);
  return _std / _mean;
}
