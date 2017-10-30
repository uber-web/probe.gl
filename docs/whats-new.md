# Version 0

probe.gl is now open source. But we are still iterating on it so we'll keep it in version 0.x for a while until the API is stable.

- **Persistent settings and saved logs** - Local storage configuration now allows for persistent configuration (including enable/disable) across browser sessions, and makes it easier to have Probe disabled (or enabled, for developers) in production. This also makes it easy to set additional development flags like `isNewFeatureEnabled`. Usage via the JS console:
```
Probe.enable().configure({level: 2, useMyDevFeature: true});
```

- **Console output links back to app** - Makes Chrome console's links point to application source code instead of Probe's source code, making it possible to click on a Probe log in the console and open the line that generated it. To achieve this, Probe methods now return log functions that app calls by applying a "()" function invocation.

- **In-memory log:** Instead of, or in addition to, logging to the console, `Probe.probe` now saves to an internal array of log messages. This allows you to turn console output off and do post-facto reporting or visualization.

- **Console groups** - Probe.groups allows independently time execution of parallel activities, using console groups to organize the output.

- **"Self Documenting" Options**

- **Duration:** Including `start` and `end` in the metadata object allows Probe
o calculate duration between calls using the same `name`:
```
Probe.probe('long_process', {start: true});
doLongProcess();
Probe.probe('long_process', {end: true});
```

- **Isomorphic Rendering support** - Use `babel-plugin-transform-runtime` to avoid hard-to-debug server side `babel-polyfill` requirement.
