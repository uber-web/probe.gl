# Stats

A collection of statistic for tracking time or magnitude metrics.

## Usage

Just create Stat objects (see `Stat` documentation) for various metrics.
```js
const stats = new Stats({id: 'my-stats'});
const memoryUsage = stats.create('Mem');
const executionTime = stats.create('Time');
memoryUsage.addCount(1024);
executionTime.timeStart();
executionTime.timeEnd();
```

## Methods

### constructor

`new Stats({id})`

* `id` (`String`) - the id of the `Stats` object.


### create

Create a new stat tracker.

`stats.create(name)`

* `name` (`String`, required) - the name of the stat tracker.

Returns the newly-created `Stat` object.


### get

Retrieve a stat tracker.

`stats.get(name)`

* `name` (`String`, required) - the name of the stat tracker.

Returns the `Stat` object identified by `name`.


### reset

Resets all stats etc.


### forEach

Iterate over all stats.

`stats.forEach(fn)`

* `fn` (`Function`, required) - function to call on each `Stat` object.

### getTimers

`stats.getTimers
