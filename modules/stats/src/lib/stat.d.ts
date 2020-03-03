/** Tracks a single statistic */
export default class Stat {
  readonly name: string;
  readonly type: string;
  sampleSize: number;
  time: number;
  count: number;
  samples: number;
  lastTiming: number;
  lastSampleTime: number;
  lastSampleCount: number;

  constructor(name: string, type?: string);

  setSampleSize(samples: number): Stat;

  /** Call to increment count (+1) */
  incrementCount(): Stat;

  /** Call to decrement count (-1) */
  decrementCount(): Stat;

  /** Increase count */
  addCount(value: number): Stat;

  /** Decrease count */
  subtractCount(value: number): Stat;

  /** Add an arbitrary timing and bump the count */
  addTime(time: number): Stat;

  // Start a timer
  timeStart(): Stat;

  // End a timer. Adds to time and bumps the timing count.
  timeEnd(): Stat;

  reset(): Stat;

  getSampleAverageCount(): number;

  /** Calculate average time / count for the previous window */
  getSampleAverageTime(): number;

  /** Calculate counts per second for the previous window */
  getSampleHz(): number;

  getAverageCount(): number;

  /** Calculate average time / count */
  getAverageTime(): number;

  /** Calculate counts per second */
  getHz(): number;
}
