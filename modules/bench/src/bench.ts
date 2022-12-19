/* eslint-disable no-console */
import {autobind, LocalStorage, getHiResTimestamp} from '@probe.gl/log';
import {formatSI} from './format-utils';
import {mean, cv} from './stat-utils';
import {logResultsAsMarkdownTable, logResultsAsTree} from './bench-loggers';

const noop = () => {};

export type LogEntryType = 'group' | 'test' | 'complete';

/** @deprecated - Just use string constants */
export const LOG_ENTRY = {
  GROUP: 'group',
  TEST: 'test',
  COMPLETE: 'complete'
};

export type LogEntry = {
  entry: LogEntryType;
  id: string;
  message: string;
  itersPerSecond: string;
  unit: string;
  error: any;
  time: number;
};

export type Logger = (entry: LogEntry) => void;

/** Properties for benchmark suite */
export type BenchProps = {
  /** Id of suite. @note Used as key for regression (storing/loading results in browser storage) */
  id?: string;
  /** Log object */
  log?: Logger | null;
  /** Minimum number of milliseconds to iterate each bench test */
  time?: number;
  /** milliseconds of idle time, or "cooldown" between tests */
  delay?: number;
  /** Increase if OK to let slow benchmarks take long time, potentially produces more stable results */
  minIterations?: number;
};

const DEFAULT_BENCH_OPTIONS: Required<BenchProps> = {
  id: '',
  log: null,
  time: 80,
  delay: 5,
  minIterations: 3
};

/** One test in the suite */
type BenchTest = {
  id: string;
  priority?: number;
  message?: string;
  initFunc?: Function;
  testFunc?: Function;
  group?: boolean;
  async?: boolean;
  once?: boolean;
  opts: BenchProps & {
    multipler?: number;
    unit?: string;
  };
};

/**
 * A benchmark suite.
 * Test cases can be added and then benchmarks can be run/
 */
export default class Bench {
  id: string;
  opts: Required<BenchProps>;
  tests: Record<string, BenchTest> = {};
  results: Record<string, unknown> = {};
  table: Record<string, any> = {};

  constructor(props: BenchProps = {}) {
    this.opts = {...DEFAULT_BENCH_OPTIONS, ...props};
    const {id, log, time, delay, minIterations} = this.opts;

    let logger = log;
    if (!logger) {
      const markdown = globalThis.probe && globalThis.probe.markdown;
      logger = markdown ? logResultsAsMarkdownTable : logResultsAsTree;
    }

    this.id = id;
    this.opts = {id, log: logger, time, delay, minIterations};
    autobind(this);
    Object.seal(this);
  }

  /** Not yet implemented */
  calibrate(id?: string, func1?: Function, func2?: Function, opts?: {}): this {
    return this;
  }

  /** Runs the test suite */
  async run(): Promise<void> {
    const timeStart = getHiResTimestamp();

    // eslint-disable-next-line @typescript-eslint/unbound-method
    const {tests, onBenchmarkComplete} = this;
    // @ts-expect-error
    await runTests({tests, onBenchmarkComplete});

    const elapsed = (getHiResTimestamp() - timeStart) / 1000;
    logEntry(this, {entry: 'complete', time: elapsed, message: 'Complete'});
    this.onSuiteComplete();
  }

  /** Adds a group to the test suite */
  group(id: string): this {
    if (this.tests[id]) {
      throw new Error('tests need unique id strings');
    }
    this.tests[id] = {id, group: true, opts: this.opts};
    return this;
  }

  add(priority, id, func1?, func2?): this {
    this._add(priority, id, func1, func2);
    return this;
  }

  // Mark test as async (returns promise)
  addAsync(priority, id, func1?, func2?): this {
    const test = this._add(priority, id, func1, func2);
    test.async = true;
    return this;
  }

  onBenchmarkComplete(params: {
    id: string;
    time: number;
    iterations: number;
    itersPerSecond: number;
  }): void {
    const {id, time, iterations, itersPerSecond} = params;
    // calculate iterations per second, save as numeric value
    const current = Math.round(iterations / time);
    // Format as human readable strings
    this.table[id] = {
      percent: '',
      iterations: `${itersPerSecond}/s`,
      current,
      max: ''
    };
  }

  onSuiteComplete(): void {
    const localStorage = new LocalStorage<Record<string, any>>(this.id, {});
    const saved = localStorage.getConfiguration();
    const current = this.updateTable(this.table, saved);
    localStorage.setConfiguration(current);
    console.table(current);
  }

  updateTable(current: Record<string, any>, saved: Record<string, any>): Record<string, any> {
    for (const id in this.table) {
      if (saved[id] && saved[id].max !== undefined) {
        current[id].max = Math.max(current[id].current, saved[id].max);
        const delta = current[id].current / saved[id].max;
        current[id].percent = `${Math.round(delta * 100 - 100)}%`;
      } else {
        current[id].max = current[id].current;
      }
    }
    return current;
  }

  // Signatures:
  //  add(id, {...options}, testFunc)
  //  add(id, testFunc)
  // Deprecated signatures
  //  add(priority, id, testFunc)
  //  add(priority, id, initFunc, testFunc)
  //  add(id, initFunc, testFunc)

  _add(priority: number | string, id: string | Function, func1: Function, func2?: Function) {
    let options = {};

    if (typeof priority === 'number') {
      console.warn('`priority` argument is deprecated, use `options.priority` instead');
    }

    if (typeof priority === 'string' && typeof id === 'object') {
      options = id;
      id = priority;
      priority = 0;
    } else if (typeof priority === 'string') {
      func2 = func1;
      func1 = id as FunctionConstructor;
      id = priority;
      priority = 0;
    }

    if (typeof id !== 'string' || typeof func1 !== 'function') {
      throw new Error('_add');
    }

    // @ts-expect-error
    let initFunc = options.initialize;
    let testFunc = func1;
    if (typeof func2 === 'function') {
      console.warn('`initFunc` argument is deprecated, use `options.initialize` instead');
      initFunc = func1;
      testFunc = func2;
    }

    // Test case options
    const opts = {
      ...this.opts,
      multiplier: 1, // multiplier per test case
      unit: '',
      ...options
    };

    if (this.tests[id]) {
      throw new Error('tests need unique id strings');
    }

    this.tests[id] = {
      id,
      priority,
      initFunc,
      testFunc,
      opts
    };
    return this.tests[id];
  }
}

// Helper methods

// Helper function to promisify setTimeout
function addDelay(timeout: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => resolve(), timeout);
  });
}

function runCalibrationTests({tests}: {tests: Record<string, BenchTest>}): void {
  // Beat JIT - run each test once
  for (const id in tests) {
    const test = tests[id];
    if (!test.group) {
      runBenchTestIterations(test, 1);
    }
  }
}

function logEntry(test: Bench, opts: any): void {
  const priority = (globalThis.probe && globalThis.probe.priority) | 10;
  if ((opts.priority | 0) <= priority) {
    opts = {...test, ...test.opts, ...opts, id: test.id};
    delete opts.opts;
    test.opts.log(opts);
  }
}

// Run a list of bench test case asynchronously (with short timeouts inbetween)
async function runTests({tests, onBenchmarkComplete = noop}) {
  // Run default warm up and calibration tests
  // @ts-expect-error
  runCalibrationTests({tests, onBenchmarkComplete});

  // Run the suite tests
  for (const id in tests) {
    const test = tests[id];
    if (test.group) {
      logEntry(test, {entry: 'group', message: test.id});
    } else {
      await runTest({test, onBenchmarkComplete});
    }
  }
}

async function runTest({test, onBenchmarkComplete, silent = false}) {
  // Inject a small delay between each test. System cools and DOM console updates...
  await addDelay(test.opts.delay);

  const result = await runBenchTestAsync(test);

  const {iterationsPerSecond, time, iterations, error} = result;

  const itersPerSecond = formatSI(iterationsPerSecond);

  if (!silent) {
    logEntry(test, {
      entry: 'test',
      itersPerSecond,
      time,
      error,
      message: `${test.id} ${itersPerSecond} ${test.opts.unit}/s ±${(error * 100).toFixed(2)}%`
    });
  }

  if (onBenchmarkComplete) {
    onBenchmarkComplete({
      id: test.id,
      time,
      iterations,
      iterationsPerSecond,
      itersPerSecond
    });
  }
}

// Test runners

async function runBenchTestAsync(test) {
  const results = [];
  let totalTime = 0;
  let totalIterations = 0;

  for (let i = 0; i < test.opts.minIterations; i++) {
    let time;
    let iterations;
    // Runs "test._throughput" parallel test cases
    if (test.async && test.opts._throughput) {
      const {_throughput} = test.opts;
      ({time, iterations} = await runBenchTestParallelIterationsAsync(test, _throughput));
    } else {
      ({time, iterations} = await runBenchTestForMinimumTimeAsync(test, test.opts.time));
    }

    // Test options can have `multiplier` to return a more semantic number
    // (e.g. number of bytes, lines, points or pixels decoded per iteration)
    iterations *= test.opts.multiplier;

    const iterationsPerSecond = iterations / time;
    results.push(iterationsPerSecond);
    totalTime += time;
    totalIterations += iterations;
  }

  return {
    time: totalTime,
    iterations: totalIterations,
    iterationsPerSecond: mean(results),
    error: cv(results)
  };
}

// Run a test func for an increasing amount of iterations until time threshold exceeded
async function runBenchTestForMinimumTimeAsync(test, minTime) {
  let iterations = 1;
  let elapsedMillis = 0;

  // Run increasing amount of interations until we reach time threshold, default at least 100ms
  while (elapsedMillis < minTime) {
    let multiplier = 10;
    if (elapsedMillis > 10) {
      multiplier = (test.opts.time / elapsedMillis) * 1.25;
    }
    iterations *= multiplier;
    const timeStart = getHiResTimestamp();
    if (test.async) {
      await runBenchTestIterationsAsync(test, iterations);
    } else {
      runBenchTestIterations(test, iterations);
    }
    elapsedMillis = getHiResTimestamp() - timeStart;
  }

  const time = elapsedMillis / 1000;

  return {
    time,
    iterations
  };
}

// Run a test func for a specific amount of parallel iterations
async function runBenchTestParallelIterationsAsync(test, iterations) {
  const testArgs = test.initFunc && test.initFunc();

  const timeStart = getHiResTimestamp();

  const promises = [];

  const {context, testFunc} = test;
  for (let i = 0; i < iterations; i++) {
    promises.push(testFunc.call(context, testArgs));
  }

  await Promise.all(promises);

  const time = (getHiResTimestamp() - timeStart) / 1000;

  return {
    time,
    iterations
  };
}

// Run a test func for a specific amount of iterations
async function runBenchTestIterationsAsync(test, iterations) {
  const testArgs = test.initFunc && test.initFunc();
  const {context, testFunc} = test;
  for (let i = 0; i < iterations; i++) {
    await testFunc.call(context, testArgs);
  }
}

// Sync tests

// Run a test func for a specific amount of iterations
function runBenchTestIterations(test, iterations) {
  const testArgs = test.initFunc && test.initFunc();

  // When running sync, avoid overhead of parameter passing if not needed
  const {context, testFunc} = test;
  if (context && testArgs) {
    for (let i = 0; i < iterations; i++) {
      testFunc.call(context, testArgs);
    }
  } else {
    for (let i = 0; i < iterations; i++) {
      testFunc.call(context);
    }
  }
}
