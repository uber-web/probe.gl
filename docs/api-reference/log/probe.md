# Probe


## Usage

Provide a formatted table of the previous N log messages. which uses `console.table()` output.
```js
Probe.table()
```

Including `start` and `end` in the metadata object allows probe.gl to calculate duration between calls using the same `name`:

```js
Probe.probe('long_process', {start: true});
doLongProcess();
Probe.probe('long_process', {end: true});
```

Set additional development flags like `isNewFeatureEnabled`. Usage via the JS console:

```js
Probe.enable().configure({level: 2, useMyDevFeature: true});
```

## Methods

### constructor
@param {Object} config Optional configuration args; see #configure

const DEFAULT_CONFIG = {
  // off by default
  isEnabled: false,
  // logging level
  level: 1,
  // Whether logging is turned on
  isLogEnabled: true,
  // Whether logging prints to console
  isPrintEnabled: true,
  // Whether Probe#run executes code
  isRunEnabled: true
};

### enable()

Turn probe on

Returns self (`Probe`), to support chaining

### disable()

Turn probe off

Returns self (`Probe`), to support chaining

### setLevel(level)

Convenience function: Set probe level
@param {Number} level Level to set

Returns self (`Probe`), to support chaining

### configure

Configure probe with new values (can include custom key/value pairs).
Configuration will be persisted across browser sessions

`Probe.configure(config = {})`

* `config` (`Object`) - named parameters
* `config.isEnabled` (`Boolean`) - Whether probe is enabled
* `config.level` (`Number`) - Logging level
* `config.isLogEnabled` (`Boolean`) - Whether logging prints to console
* `config.isRunEnabled` (`Boolean`) - Whether #run executes code

Returns self (`Probe`), to support chaining

### getOption

Get a single option from preset configuration. Useful when using Probe to
set developer-only switches.

`getOption(key)`

@param  {String} key Key to get value for
Returns (mixed)     Option value, or undefined


### getLog()

Get current log, as an array of log row objects

getLog

Returns (Object[]) Log


### isEnabled()

Whether Probe is currently enabled
Returns (Boolean) isEnabled

### reset()
Reset all internal stores, dropping logs

### resetStart()

Reset the long timer

### resetDelta()

Reset the time since last probe

### getTotal()

Returns (Number) milliseconds, with fractions

### getDelta()

Returns (Number) milliseconds, with fractions


### probe(...args)

Displays a double timing (from "start time" and from last probe).

### probe1(...args)

### probe2(...args)

### probe3(...args)


### sample(...args)

Display an averaged value of the time since last probe.
Keyed on the first string argument.

### sample1(...args)

### sample2(...args)

### sample3(...args)

### fps(...args)

  These functions will average the time between calls and log that value
  every couple of calls, in effect showing a times per second this
  function is called - sometimes representing a "frames per second" count.

### fps1(...args)

### fps2(...args)

### fps3(...args)


### externalProbe(...args)

Display a measurement from an external source, such as a server,
inline with other local measurements in the style of Probe's output.

### externalProbe1(...args)

### externalProbe2(...args)

### externalProbe3(...args)

### run(func, arg)
Conditionally run a function only when probe is enabled

### startIiterations()

_getConfigFromEnvironment()

Get config from persistent store, if available
Returns (Object) config


getIterationsPerSecond(iterations = 10000, func = null, context)
/* Count iterations per second. Runs the provided function a
specified number of times and normalizes the result to represent
iterations per second.
 *
TODO/ib Measure one iteration and auto adjust iteration count.


### logIterationsPerSecond(
  testName, iterations = 10000, func = null, context = null
)

Print the number of iterations per second measured using the provided function

### table(tail)
Show current log in a table, if supported by console
@param {Number} tail If supplied, show only the last n entries
