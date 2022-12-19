// probe.gl, MIT license

/** mean */
export function mean(numbers: number[]): number {
  return numbers.reduce((sum, x) => sum + x, 0) / numbers.length;
}

/** standard deviation */
export function std(numbers: number[], precalculatedMean?: number): number {
  if (numbers.length <= 1) {
    return 0;
  }

  const meanValue = precalculatedMean === undefined ? mean(numbers) : precalculatedMean;

  return Math.sqrt(
    numbers.reduce((d, x) => d + (x - meanValue) * (x - meanValue), 0) / (numbers.length - 1)
  );
}

/** coefficient of variation */
export function cv(numbers: number[]): number {
  const _mean = mean(numbers);
  const _std = std(numbers, _mean);
  return _std / _mean;
}
