# Stat

A tracker for a single statistic.

## Usage

Create a `Stat` instance using `Stats.create`. There are two basic usage patterns, `timer` and `counter`.
`Timer` usage involves the methods `timeStart`, `timeEnd`, `addTime`, `getHz`, and `getAverageTime`:

```js
const stats = new Stats({id: 'my-stats'});
const executionTime = stats.create('Time');
executionTime.timeStart();
executionTime.timeEnd();
executionTime.addTime(16);

// getHz and getAverageTime based on the
// number of individual timings that were taken
executionTime.getHz();
executionTime.getAverageTime();
```

`Counter` usage involves the methods `incrementCount`, `decrementCount`, `addCount`, and `subtractCount`:

```js
const stats = new Stats({id: 'my-stats'});
const memoryUsage = stats.create('Mem');
memoryUsage.incrementCount();
memoryUsage.decrementCount();
memoryUsage.addCount(1024);
memoryUsage.subtractCount(512);
```

## Properties

### name : String

Name of the stat.


### count : Number

Accumulated count or number of timings.


### time : Number

Accumulated time from all timings.


### lastTiming : Number

Last timing taken.


## Methods

### constructor

`new Stat(name)`

* `name` (`String`) - the name of the stat.


### incrementCount

Increase `count` by `1`.

`stat.incrementCount()`


### decrementCount

Decrease `count` by `1`.

`stat.decrementCount()`


### addCount

Increase `count` by `value`.

`stat.addCount(value)`

* `value` (`Number`, required) - the amount to add to `count`.


### subtractCount

Decrease `count` by `value`.

`stat.subtractCount(value)`

* `value` (`Number`, required) - the amount to subtract from `count`.


### timeStart

Start a timer.

`stat.timeStart()`


### timeEnd

End a timer. Time elapsed since the last `timeStart` is
added to `time` and `count` is incremented by `1`.

`stat.timeEnd()`


### addTime

Increase `time` by `value` and increment `count` by `1`.

`stat.addTime(value)`

* `value` (`Number`, required) - time in millisecons to add to `time`.


### getHz

Calculate the average number of timing events per second (i.e. `count / (time * 1000)`.

`stat.getHz()`


### getAverageTime

Calculate the average amount of time take per timing event in milliseconds (i.e. `time / count`.

`stat.getAverageTime()`




