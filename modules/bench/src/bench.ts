// probe.gl, MIT license

/* eslint-disable no-console */
import {autobind, LocalStorage, getHiResTimestamp} from '@probe.gl/log';
import {formatSI} from './format-utils';
import {mean, cv} from './stat-utils';
import {logResultsAsMarkdownTable, logResultsAsTree} from './bench-loggers';

declare global {
  // eslint-disable-next-line no-var
  var probe: {
    priority?: number;
    markdown?: boolean;
  };
}

const noop = () => {};

/** Properties for benchmark suite */
export type BenchProps = {
  /** Id of suite. @note Used as key for regression (storing/loading results in browser storage) */
  id?: string;
  /** Log object */
  log?: LogFunction;
  /** Minimum number of milliseconds to iterate each bench test */
  time?: number;
  /** milliseconds of idle time, or "cooldown" between tests */
  delay?: number;
  /** Increase if OK to let slow benchmarks take long time, potentially produces more stable results */
  minIterations?: number;
};

export type BenchTestFunction = <T>(testArgs?: T) => T | Promise<T>;
export type BenchInitFunction = () => unknown;

/** Options for a specific test case */
export type BenchTestCaseProps = {
  id?: string;
  priority?: number;
  message?: string;
  initialize?: BenchInitFunction | null;
  test?: BenchTestFunction | null;
  async?: boolean;
  once?: boolean;

  /** Minimum number of milliseconds to iterate each bench test */
  time?: number;
  /** milliseconds of idle time, or "cooldown" between tests */
  delay?: number;
  /** Increase if OK to let slow benchmarks take long time, potentially produces more stable results */
  minIterations?: number;
  multiplier?: number;
  unit?: string;
  _throughput?: number;
};

/** One benchmark log entry */
export type LogEntry = GroupLogEntry | TestLogEntry | CompleteLogEntry;

export type GroupLogEntry = {
  type: 'group';
  id: string;
  message: string;
};

export type TestLogEntry = {
  /** Type of benchmark log entry */
  type: 'test';
  id: string;
  message: string;
  itersPerSecond: string;
  unit: string;
  error: number;
  time: number;
};

export type CompleteLogEntry = {
  type: 'complete';
  time: number;
  message: string;
};

/** Type for (custom) log functions */
export type LogFunction = (entry: LogEntry) => void;

type BenchTestCase = {
  id: string;
  priority: number;
  message: string;
  initialize: BenchInitFunction | null;
  test: BenchTestFunction | null;
  group: boolean;
  async: boolean;
  once: boolean;

  /** Minimum number of milliseconds to iterate each bench test */
  time: number;
  /** milliseconds of idle time, or "cooldown" between tests */
  delay: number;
  /** Increase if OK to let slow benchmarks take long time, potentially produces more stable results */
  minIterations: number;
  multiplier: number;
  unit: string;
  _throughput: number;

  context: any;
};

/* eslint-disable @typescript-eslint/no-non-null-assertion */
const DEFAULT_BENCH_OPTIONS: Required<BenchProps> = {
  id: '',
  log: undefined!,
  time: 80,
  delay: 5,
  minIterations: 3
};

const DEFAULT_BENCH_TEST_CASE: BenchTestCase = {
  id: undefined!,
  message: undefined!,
  priority: 0,
  group: false,
  test: null,
  initialize: null,
  async: false,
  once: false,
  time: 0,
  minIterations: 1,
  multiplier: 1, // multiplier per test case
  unit: '',
  delay: 0,
  _throughput: undefined!,
  context: null
};
/* eslint-enable @typescript-eslint/no-non-null-assertion */

/**
 * A benchmark suite.
 * Test cases can be added and then benchmarks can be run/
 */
export class Bench {
  id: string;
  props: Required<BenchProps>;
  testCases: Record<string, BenchTestCase> = {};
  results: Record<string, unknown> = {};
  table: Record<string, any> = {};

  constructor(props: BenchProps = {}) {
    this.props = {...DEFAULT_BENCH_OPTIONS, ...props};
    const {id, time, delay, minIterations} = this.props;

    let log = this.props.log;
    if (!log) {
      const markdown = globalThis.probe && globalThis.probe.markdown;
      log = markdown ? logResultsAsMarkdownTable : logResultsAsTree;
    }

    this.id = id;
    this.props = {id, log, time, delay, minIterations};
    autobind(this);
    Object.seal(this);
  }

  /** Not yet implemented */
  // eslint-disable-next-line
  calibrate(id?: string, func1?: Function, func2?: Function, props?: {}): this {
    return this;
  }

  /** Runs the test suite */
  async run(): Promise<void> {
    const timeStart = getHiResTimestamp();

    // eslint-disable-next-line @typescript-eslint/unbound-method
    const {testCases, onBenchmarkComplete} = this;
    // @ts-expect-error
    await runTests({bench: this, testCases, onBenchmarkComplete});

    const elapsed = (getHiResTimestamp() - timeStart) / 1000;
    logEntry(this.props.log, null, {type: 'complete', time: elapsed, message: 'Complete'});
    this.onSuiteComplete();
  }

  /** Adds a group to the test suite */
  group(id: string): this {
    if (this.testCases[id]) {
      throw new Error('tests need unique id strings');
    }
    this.testCases[id] = {...DEFAULT_BENCH_TEST_CASE, id, group: true};
    return this;
  }

  add(id: string, test: BenchTestFunction): this;
  add(id: string, testCase: BenchTestCaseProps, test: BenchTestFunction): this;

  add(
    id: string,
    testCase: BenchTestCaseProps | BenchTestFunction,
    test?: BenchTestFunction
  ): this {
    if (test) {
      this._addTestCase({...testCase, id, test});
    } else {
      this._addTestCase({id, test: testCase as BenchTestFunction});
    }
    return this;
  }

  // Mark test as async (returns promise)
  addAsync(id: string, test: BenchTestFunction): this;
  addAsync(id: string, testCase: BenchTestCaseProps, test: BenchTestFunction): this;

  addAsync(
    id: string,
    testCase: BenchTestCaseProps | BenchTestFunction,
    test?: BenchTestFunction
  ): this {
    if (test) {
      this._addTestCase({...testCase, id, test, async: true});
    } else {
      this._addTestCase({id, test: testCase as BenchTestFunction, async: true});
    }
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

  _addTestCase(testCaseProps: BenchTestCaseProps): void {
    if (!testCaseProps.id || this.testCases[testCaseProps.id]) {
      throw new Error('tests need unique id strings');
    }

    const testCase: BenchTestCase = {...DEFAULT_BENCH_TEST_CASE, ...this.props, ...testCaseProps};

    this.testCases[testCaseProps.id] = testCase;
  }
}

// Helper methods

// Helper function to promisify setTimeout
function addDelay(timeout: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), timeout);
  });
}

function runCalibrationTests({testCases}: {testCases: Record<string, BenchTestCase>}): void {
  // Beat JIT - run each test once
  for (const testCase of Object.values(testCases)) {
    if (!testCase.group) {
      runBenchTestCaseIterations(testCase, 1);
    }
  }
}

function logEntry(logFunction: LogFunction, testCase: BenchTestCase | null, entry: LogEntry): void {
  const priority = globalThis.probe.priority || 10;
  if ((testCase?.priority || 0) <= priority) {
    logFunction({...entry});
  }
}

// Run a list of bench test case asynchronously (with short timeouts inbetween)
async function runTests({
  bench,
  testCases,
  onBenchmarkComplete = noop
}: {
  bench: Bench;
  testCases: BenchTestCase[];
  onBenchmarkComplete?: Function;
}) {
  // Run default warm up and calibration testCases
  // @ts-expect-error
  runCalibrationTests({testCases, onBenchmarkComplete});

  // Run the suite testCases
  for (const testCase of Object.values(testCases)) {
    if (testCase.group) {
      logEntry(bench.props.log, testCase, {type: 'group', message: testCase.id, id: testCase.id});
    } else {
      await runTest({bench, testCase, onBenchmarkComplete});
    }
  }
}

async function runTest({
  bench,
  testCase,
  onBenchmarkComplete,
  silent = false
}: {
  bench: Bench;
  testCase: BenchTestCase;
  onBenchmarkComplete?: Function;
  silent?: boolean;
}) {
  // Inject a small delay between each testCase. System cools and DOM console updates...
  if (testCase.delay) {
    await addDelay(testCase.delay);
  }

  const result = await runBenchTestCaseAsync(testCase);

  const {iterationsPerSecond, time, iterations, error} = result;

  const itersPerSecond = formatSI(iterationsPerSecond);

  if (!silent) {
    logEntry(bench.props.log, testCase, {
      type: 'test',
      itersPerSecond,
      time,
      error,
      message: `${testCase.id} ${itersPerSecond} ${testCase.unit}/s ±${(error * 100).toFixed(2)}%`,
      id: testCase.id,
      unit: testCase.unit
    });
  }

  if (onBenchmarkComplete) {
    onBenchmarkComplete({
      id: testCase.id,
      time,
      iterations,
      iterationsPerSecond,
      itersPerSecond
    });
  }
}

// Test runners

async function runBenchTestCaseAsync(testCase: BenchTestCase) {
  const results: number[] = [];
  let totalTime = 0;
  let totalIterations = 0;

  const minIterations: number = testCase.minIterations || 1;

  for (let i = 0; i < minIterations; i++) {
    let time;
    let iterations;
    // Runs "testCase._throughput" parallel testCase cases
    if (testCase.async && testCase._throughput) {
      ({time, iterations} = await runBenchTestCaseParallelIterationsAsync(
        testCase,
        testCase._throughput
      ));
    } else {
      ({time, iterations} = await runBenchTestCaseForMinimumTimeAsync(
        testCase,
        testCase.time || 0
      ));
    }

    // Test options can have `multiplier` to return a more semantic number
    // (e.g. number of bytes, lines, points or pixels decoded per iteration)
    iterations *= testCase.multiplier || 1;

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
async function runBenchTestCaseForMinimumTimeAsync(
  testCase: BenchTestCase,
  minTime: number
): Promise<{time: number; iterations: number}> {
  let iterations = 1;
  let elapsedMillis = 0;

  // Run increasing amount of interations until we reach time threshold, default at least 100ms
  while (elapsedMillis < minTime) {
    let multiplier = 10;
    if (elapsedMillis > 10) {
      multiplier = ((testCase.time || 0) / elapsedMillis) * 1.25;
    }
    iterations *= multiplier;
    const timeStart = getHiResTimestamp();
    if (testCase.async) {
      await runBenchTestCaseIterationsAsync(testCase, iterations);
    } else {
      runBenchTestCaseIterations(testCase, iterations);
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
async function runBenchTestCaseParallelIterationsAsync(
  testCase: BenchTestCase,
  iterations: number
): Promise<{time: number; iterations: number}> {
  const testArgs = testCase.initialize && testCase.initialize();

  const timeStart = getHiResTimestamp();

  const promises: Promise<unknown>[] = [];

  const {context, test} = testCase;
  for (let i = 0; i < iterations; i++) {
    promises.push(Promise.resolve(test?.call(context, testArgs)));
  }

  await Promise.all(promises);

  const time = (getHiResTimestamp() - timeStart) / 1000;

  return {
    time,
    iterations
  };
}

// Run a test func for a specific amount of iterations
async function runBenchTestCaseIterationsAsync(
  testCase: BenchTestCase,
  iterations: number
): Promise<void> {
  const testArgs = testCase.initialize && testCase.initialize();
  const {context, test} = testCase;
  for (let i = 0; i < iterations; i++) {
    await test?.call(context, testArgs);
  }
}

// Sync tests

// Run a test func for a specific amount of iterations
function runBenchTestCaseIterations(testCase: BenchTestCase, iterations: number): void {
  const testArgs = testCase.initialize && testCase.initialize();

  // When running sync, avoid overhead of parameter passing if not needed
  const {context, test} = testCase;
  if (context && testArgs) {
    for (let i = 0; i < iterations; i++) {
      test?.call(context, testArgs);
    }
  } else {
    for (let i = 0; i < iterations; i++) {
      test?.call(context);
    }
  }
}
