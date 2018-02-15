# probe.gl

Small collection of JavaScript front-end debugging tools

* A JavaScript logging library focused on facilitating debugging and performance instrumentation of front-end applications.
* A benchmark rig to help measure and track regressions of critical functions
* Test drivers to help do automated browser testing from node


## Comparison with other Logging Solutions

proble.gl's focus on debugging and performance instrumentation of front-end applications has lead to different design choices and priorities compared with logging libraries that are designed for facilitating logging of production code in back-end services. Those libraries are often focused on integrating with various logging backends (log to file, log to server, etc) and not on integrating with the browser console and the front-end debugging workflow.


## Features


* **Off by default** - probe.gl makes efforts to have a minimal performance footprint when not enable, to let you consider leaving your probes switched off in production code.
* **Lightweight** - probe.gl is designed to have a small impact on application bundle size and to avoid dependencies on other modules.

### Logging Support

The basic logging support provided by probe.gl is simple but surprisingly useful.

* **Priority levels** - Your logs will only be displayed when the user has enabled probe.gl and the specified priority level has been set.
* **Defeats log cascades** - Caches warnings to ensure only one of each warning is emitted to avoid flooding the console.
* **Readable assert Errors** - Reformats `assert` messages to show actual error string
* **Image Logging** - Images can be logged to console (Chrome only)
* **Source Code Links** - Clicking probe.gl log messages in the browser console takes you to the source code line where the probe function was called, even though you are not calling `console` methods directly.


### Profiling Support

Instrument your applications by adding probes to get timings in browser console or in node. The probes then collect data about your application when you run it.

* **High-Resolution Timers** - probe.gl uses the best available timers on the platform, such as `window.performance.now()` and `hrtime` to get better than millisecond timings.
* **Multiple Timers** - Your "probes" automatically log both time since operation start and delta time since last probe.
* **External Timers** - Timing metrics received e.g. from a server can be presented as part of client side timings.


### Persistent Configuration

probe.gl offers a basic persistent configuration system:

* **Persistent Configuration** - probe.gl persists its configuration in local storage, so you can restart your app without having to change settings, speeding up debugging.
* **Extensible Configuration** - flags and values in probe.gl's configuration are available to your app. Built-in options include enabling probe, setting log level, help etc.


### Cross platform support

* **Supports Node and Browser** - Use with confidence in code that runs in both environments (e.g. test suites or isomorphic React apps).
* **Auto-detects platform APIs** - Uses the best available versions of platform-dependent facilities like high resolution timers, console methods etc.
* **Limited impact on global state** - Other than some light polyfills for `console` and a global reference to the probe library, the lib doesn't modify global state.


### Debug Features

debug related facilities, such as console log interception, global context in debugger etc.


### Benchmarking Support

In addition to in-app profiling, probe also supports a simple benchmarking rig

* **Benchmark Suite** - function to run a suite of functions and collect data
* **Persist and Compare Benchmarks** - 


## History

probe.gl serves as the common instrumentation and logging library for frameworks in the Uber Visualization Suite.

The 'probe' part of the name relates to the concept of instrumenting your application by injecting "probes" (i.e. information collection checkpoints) into its source code. The suffix '.gl' is added to hint that this library is associated with the suite, rather than to signal any dependency on WebGL.


