export const LOG_ENTRY: {
  GROUP: 'group',
  TEST: 'test',
  COMPLETE: 'complete'
};

/** A suite of benchmarks. Benchmarks can be added and the suite can then be run. */
export default class Bench {
  constructor(options?: {
    /** Name is needed for regression (storing/loading) */
    id: string,
    log?: any,
    time?: number,
    delay?: number;
    minIterations?: number;
  });

  calibrate(id, func1, func2, opts): Bench;
  run(): Promise<void>;

  group(id: string): Bench;

  add(priority, id, func1, func2): Bench;

  /** Marks the added test as async (i.e. test returns promise) */
  addAsync(priority, id, func1, func2): Bench;

  onBenchmarkComplete(options: {
    id: string, time: number, iterations: number, itersPerSecond: number
  }): void;
  onSuiteComplete(): void;
  updateTable(current: any, saved: any): any;
}
