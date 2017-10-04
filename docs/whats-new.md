# What's New

## Version 0

probe.gl is now open source. We'll keep it in 0.x version for a while until the API is stable.


### Isomorphic Rendering support
* Use babel-plugin-transform-runtime to avoid hard-to-debug server side babel-polyfill requirement.
* Add experimental support for LocalStorage
* Remove dependencies (cookie-cutter and qs).

### Console groups
- Probe.groups allows independently time execution of parallel activities, using console groups to organize the output.
- "self documenting" options.
- Idle timers

### Console output links back to app
- Makes Chrome console's links point to application source code instead of Probe's source code, making it possible to click on a Probe log in the console and open the line that generated it. To achieve this, Probe methods now return log functions that app calls by applying a "()" function invocation.
- More human readable format for console log.

### a single class, persistent settings and saved logs

This updates Probe to be a single class, which simplifies dealing with methods, global state, etc, and allows applications to instantiate standalone Probe instances as necessary. This also adds several features:

**Cookie-based configuration:** Dropped the URL parameter-based configuration, which played poorly with URL params in Allen Key, in favor of a cookie-based configuration. This allows for persistent configuration (including enable/disable) across browser sessions, and makes it easier to have Probe disabled (or enabled, for developers) in production. This also makes it easy to set additional development flags like `isNewFeatureEnabled`. Usage via the JS console:
```
Probe.enable().configure({level: 2, useMyDevFeature: true});
```

**New API:** Rather than take a list of arbitrary args, all `probe` etc methods now have the signature `probe(name, meta)` where `meta` is additonal structured info to log. This makes it easier to add new quanititative data to the logs.

**In-memory log:** Instead of, or in addition to, logging to the console, `Probe.probe` now saves to an internal array of log messages. This allows you to turn console output off and do post-facto reporting or visualization. 
This diff adds one reporting method, `Probe.table()`, which uses `console.table()` output to provide a formatted table of the previous N log messages.

**Duration:** Including `start` and `end` in the metadata object allows Probe
o calculate duration between calls using the same `name`:

```
Probe.probe('long_process', {start: true});
doLongProcess();
Probe.probe('long_process', {end: true});
```

* Other than some light polyfills for `console`, the lib doesn't modify
global state at all. It exports a singleton,
but it's the app's responsibility to attach it to `window` if desired.
* Dropped the querystring handling.

- "Rejected promise" interceptor.
- Add console warning interceptor
- add iteration counter

### 0.1.2 Fix Node check
### 0.1.0 Add high-resolution timer, samples, fps, formatting, node support, initial README.
### 0.0.1 Initial version
