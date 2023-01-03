# Bench

Bench is a benchmark harness that allows you to organize a number of 
benchmarks / performance tests into a Benchmark suite that can be executed 
with a single command. 

Each test must be registered with a unique `id` which allows `Bench` to do compare results across runs and perform limited regression testing.

> Precise, repeatable performance measuring on a modern multi-tasking OS is hard, as subsequent runs might be scheduled different by the OS. The consistency between repeated benchmark tests tend to be within +- 10-15% and is generally sufficient for verifying incremental improvements.

## Usage

```js
import {Bench} from '@probe.gl/bench';

const bench = new Bench()
  .group('Utility tests')
  .add('Math.sqrt', () => Math.sqrt(100))
  ;

bench.run();
```

## Methods

### constructor

`new Bench({})`

### group(id)

Adds a group header.

`bench.group(id)`

### add

Adds a test case. Supports multiple signatures:

`bench.add(id: string, testCaseProps: TestCaseProps, testFunc: () => unknown)`
`bench.add(id: string, testFunc: () => unknown)`

Parameters

* `id` (String) - The unique string for this test. Used as the description of the test in the results.
* `testFunc` (Function, options) - Function run for each test iteration.

Options

* `priority`=`0` (Number, optional) - allows controlling which bench cases execute. Can also be specified through the `options` object.
* `initialize`=: `() => any` initialization function called once before `testFunc` iterations start.
* `multiplier`=`1` : `Number` Multiplier applied to the number of actual iterations. Use this if each test case already performs a number of iterations. Affects reporting only.
* `unit`=`'iterations'`: Can be used to customize the output message for bench results.
* `_throughput`=`false` : `Number` Use with `Bench.addAsync` to specify that `_throughput` iterations should be run in parallel. Note that automatic iteration selection is not available in this case.

Returns: itself for chaining.

## addAsync

Adds an async test case. Use when `testFunc` returns a promise. Supports same signatures as `add`. 

`bench.add(id: string, testCaseProps: TestCaseProps, testFunc: () => Promise<unknown>)`
`bench.add(id: string, testFunc: () => Promise<unknown>)`

When using `addAsync`, `testFunc` is expected to return a promise.

### run()

`bench.run()`

### calibrate

`bench.calibrate(id, func1, func2, opts)`
