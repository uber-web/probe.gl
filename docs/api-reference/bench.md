# Bench

Bench is a simple benchmark harness that allows you to register performance tests with ids.


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

`bench.group(id)`

### add(id, func1, func2, opts)

`bench.add(id, func1, func2, opts)`

### run()

`bench.run()`

### calibrate

`bench.calibrate(id, func1, func2, opts)`
