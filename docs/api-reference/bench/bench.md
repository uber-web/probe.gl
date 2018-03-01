# Bench

Bench is a benchmark harness class that allows you to organize a number of benchmarks / performance tests into a Benchmark suite that can be executed with a single comment. Each test is registered with and `id` which allows `Bench` to do compare results across runs and perform limited regression testing.


## Usage

```js
const bench = new Bench()
  .group('Utility tests')
  .add('Math.sqrt', () => Math.sqrt(100))
  ;

bench.run();
```

## Methods

### constructor

`new Bench({})`
* timeouts = true,
* log = console.log.bind(console)

### group(id)

Adds a group header.

`bench.group(id)`

### add

Adds a test case. Supports multiple signatures

`bench.add(priority, id, initFunc, testFunc)`
`bench.add(priority, id, testFunc)`
`bench.add(id, initFunc, testFunc)`
`bench.add(id, testFunc)`

* `priority`=`0` (Number, optional) - allows controlling which bench cases execute.
* `id` (String)
* `initFunc` (Function, options) -
* `testFunc` (Function, options) -

### run()

`bench.run()`

### calibrate

`bench.calibrate(id, func1, func2, opts)`
