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

`new Stats({id, stats})`

* `id` (`String`) - the id of the `Stats` object.
* `stats` (`Stat[] || Object[]`) - the list of stats. Each element in the stats could be either`Stat` object or `{name, type}` (type is optional, default is `count`);


### get

Retrieve a stat tracker. Create it if it doesn't already exist.

`stats.get(name, type)`

* `name` (`String`, required) - the name of the stat tracker.
* `type` (`String`, optional) - the type of the stat tracker. Default is `count`.

Supported types are described in [Stat](/docs/api-reference/log/stat.md)

Returns the `Stat` object identified by `name`.


### reset

Resets all stats.

`stats.reset()`


### forEach

Iterate over all stats.

`stats.forEach(fn)`

* `fn` (`Function`, required) - function to call on each `Stat` object.

### getTable

Return stats in a format suitable for `console.table`

`stats.getTable()`
