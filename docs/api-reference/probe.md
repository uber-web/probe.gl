# Probe


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
@return {Probe} self, to support chaining

### disable()

Turn probe off
@return {Probe} self, to support chaining

### setLevel(level)

Convenience function: Set probe level
@param {Number} level Level to set
@return {Probe} self, to support chaining

### configure(config = {})

Configure probe with new values (can include custom key/value pairs).
Configuration will be persisted across browser sessions
@param {Object} config - named parameters
@param {Boolean} config.isEnabled Whether probe is enabled
@param {Number} config.level Logging level
@param {Boolean} config.isLogEnabled Whether logging prints to console
@param {Boolean} config.isRunEnabled Whether #run executes code
@return {Probe} self, to support chaining

  const newConfig = Object.assign({}, this._config, config);
  this._config = newConfig;
  // if (!IS_NODE)
  //   const serialized = JSON.stringify(newConfig);
  //   cookie.set(COOKIE_NAME, serialized);
  // }
  // Support chaining
  return this;


### getOption(key)

Get a single option from preset configuration. Useful when using Probe to
set developer-only switches.
@param  {String} key Key to get value for
@return {mixed}     Option value, or undefined


### getLog()

Get current log, as an array of log row objects
@return {Object[]} Log


### isEnabled()

Whether Probe is currently enabled
@return {Boolean} isEnabled

### reset()
Reset all internal stores, dropping logs

### resetStart()

Reset the long timer

### resetDelta()

Reset the time since last probe

### getTotal()

@return {Number} milliseconds, with fractions

### getDelta()

@return {Number} milliseconds, with fractions


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
@return {Object} config

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
