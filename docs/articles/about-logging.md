# Console Logging

> This doc is a WIP

### Probe API Signature

A probe.gl function invocation typically looks like this:
```js
log.probe(priority, message, ...args)();
```

There are a lot of conventions and built-in capabilities. The following sections contains observations about this signature and provide more background about what is going on.


### Why Double Function Calls?

A distinctive aspect of the probe API is the requirement for double function calls, i.e. the extra parenthesis at the end of `log.probe``(...)()`. The double function calls ensure that the Chrome browser console's clickable links are generated correctly. Thanks to these double parentheses you can click on a probe in the Chrome console and "go" directly to the probe call in your application source code.

The double parenthesis is a rather unusual JavaScript programming idiom and if you forget it nothing will be logged. Therefore probe.gl will keep track of whether a returned log function was called and warn you next time you call probe if it wasn't.


### Log Priority

A basic feature of probe.gl is that you can assign a `priority` threshold to each probe. The term `priority` can seem a little counter-intuitive at first, as specifying a higher value in your probes actually make them less likely to "fire". The basic idea is that a probe will only "fire" if the log priority is greater than or equal to the probe's priority.

Because of this most probe.gl APIs take a `priority` parameter as a first argument.

| `0` | Unconditional. Always fires. errors and warnings are priority `0` by default. |
| `1` | Fires . |
| `2` | Always fires. |
| `3` | Always fires. |
| `4` | Always fires. |

Note that regardless of log level, probes will only fire assuming probe itself is enabled.


### Log Options

The `priority` parameter is an overloaded parameter that can be supplied in the following ways:
* `priority` can be ommitted entirely. In this case, `priority` defaults to `0`, which means that the probe is executed / printed regardless of log level.
* `priority` can be a `Number`, in which case it is used as the `priority` threshold of this probe, which will only "fire" if the log priority is greater than or equal to this value.
* `priority` can be an `Object`, in which case it is used as the `priority` threshold of this probe. It will only "fire" if the log priority is greater than or equal to this value.

* `priority` (`Number`) - as above, if not supplied defaults to `0` (fires unconditonally if probe is enabled).
* `once` (`Boolean`|`Number`) - if `true`, the argument string will be cached and this log will only be fired once. If a number, this is the minimum amount of seconds between logging the same message.


### Log Message

Many probe.gl API calls take a `message` parameter. This `message` is an overloaded parameter that can be either a string or a function that returns a string, which will be called every time the probe fires.

The main purpose of supporting functions is to avoid situations where a message string is being generated even when the probe doesn't fire:

A typical inconvenience when logging is unwanted performance impact when generating dynamic log messages. In the case below, the string template literal is being generated every time the line executes, *even when logging is disabled*:
```js
log.probe(1, `${object} has ${value}`)();
```
With probe, the solution is easy:
```js
log.probe(1, () => `${object} has ${value}`)();
```
Now the performance overhead of the probe is again minimized.


### Log Parameters

Most probe method accept a variable number of additional arguments at the end of the function call. These arguments will be passed directly to the underlying console method. This allows you to leverage the built-in Chrome console printing mechanisms for e.g. Objects and Arrays (these allow you to expand and descend into objects).


## Probe Timings


## Types of Probes

### Groups

Chrome provides a wonderful grouping feature that allows us to organize logs in expandable headers.

### Tables

Chrome provides a table logging method

### Images

Under Chrome it is possible to log images to the console, using a rather involved styling trick. `log.image` will be a no-op under all other environments.




