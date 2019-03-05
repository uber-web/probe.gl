# Stats

A collection of statistic for tracking time or magnitude metrics.

## Usage

Just create Stat objects (see `Stat` documentation) for various metrics.
```js
const stats = new Stats({id: 'my-stats'});
const memoryUsage = stats.get('Mem');
const executionTime = stats.get('Time');
memoryUsage.addCount(1024);
executionTime.timeStart();
executionTime.timeEnd();
```

## Methods

### constructor

`new Stats({id})`

* `id` (`String`) - the id of the `Stats` object.


### get

Retrieve a stat tracker. Create it if it doesn't already exist.

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
