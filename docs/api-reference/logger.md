# Logger

> Experimental API

A simple console wrapper
* Papers over missing methods
* Supports logging with priority levels
* Caches warnings to ensure only one of each warning is emitted
* Reformats assert messages to show actual error string
* Console shows actual log function call site, not wrapper call site
* Can log images under Chrome


## About Priority and Options

Many log commands take a `priority` parameter as a first argument. This is an overloaded parameter that can be supplied in the following ways:
* `priority` can be ommitted entirely. In this case, `priority` defaults to `0`, which means that the probe is executed / printed regardless of log level.
* Priority can be a `Number`, in which case it is used as the `priority` threshold of this probe, which will only "fire" if the log priority is greater than or equal to this value.


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
