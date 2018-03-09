# Stats

A class for tracking performance over time, in terms of frames per second or operations per second, suitable for integration with stats widgets.

* "counters" for discrete events
* "timers" for counting processing of a specific category


## Usage

Just inform your `Stats` instance when something happens. Then query it and get the FPS averages.
```js
const stats = new Stats();
for (let i = 0; i < 100; i++) {
  stats.bump('fps')
}
```

Get the counters from a stats instance. Don't forget to reset it!
```js
const counters stats.getCounters();
stats.reset();
```


## Methods

### constructor

`new Stats({id})`

* `id` (`String`) - the id of the counter.


### addCounter


### bump

Increments a counter. The counter will automatically be added and initialize to `0`, if not already initialized.

`stats.bump(counter, count)`

* `counter` (`String`, required) - the name of the counter to bump.
* `count`=`1` (`Number`) - the number to inc

Retuns the `Stats` instance to allow chaining.


### setCounter

Sets a counter


### reset

Resets all counters, timers etc.


### getCounters


### getTimers

`stats.getTimers