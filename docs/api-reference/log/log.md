# Log

A simple console wrapper
* Handles missing methods
* Supports log levels (priorities)
* Defeat cascades - Caches warnings to ensure only one of each warning is emitted
* Improved `assert` messages - Reformats errors from `assert` to show actual error string
* Shows actual log call site - Console does not link to wrapper call site
* Images logging - In Chrome console


## About Priority and Options

Log functions can be called in a couple of ways
- `log.___(message, ...args)` - priority defaults to 0
- `log.___(priority, message, ...args)` - sets priority
- `log.___({...options}, message, ...args)` - additional options can be set, priority is zero
- `log.___({priority, ...options}, message, ...args)` - additional options can be set
- `log.___({priority, ...options, message, args})` - additional options can be set

Supported options include:
* `priority` (`Number`), this probe will only "fire" if the log's current priority is greater than or equal to this value.defaults to `0`, which means that the probe is executed / printed regardless of log level.
* `color` (String) - basic colors like `green`, `blue` and `red` are supported, currently only for console logging.


* The `message` argument can be a string or a function.

## Methods

getPriority()

`log(priority|opts, arg, ...args)`

Returns: a function closure that needs to be called immediately.


### info

Log a normal message

`log.info(priority|opts, arg, ...args)()`

Returns: a function closure that needs to be called immediately.


### once

Log a normal message, but only once, no console flooding

`once(priority|opts, arg, ...args)`

Returns: a function closure that needs to be called immediately.


### warn

Warns, but only once to avoid console flooding. Uses the `console.warn` method, to enable filtering 

`log.warn(arg, ...args)`

Returns: a function closure that needs to be called immediately.


### error

Print an error, using the console's error method

`error(arg, ...args)`

Returns: a function closure that needs to be called immediately.


### deprecated

Generates a deprecation warning:
"`oldUsage` is deprecated and will be removed in a later version. Use `newUsage` instead."

`deprecated(oldUsage, newUsage)`

The warning will be generated using c


### once

`once(priority, arg, ...args)`


### table

`table(priority|opts, table)`


### image

Logs an image (under Chrome)

`image({priority, image, message = '', scale = 1})`

// Logs a message with a time
time(priority, label)

timeEnd(priority, label)

group(priority, arg, {collapsed = false} = {})

groupEnd(priority, arg)
