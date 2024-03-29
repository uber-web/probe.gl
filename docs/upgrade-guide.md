# Upgrade Guide

## Upgrading to v4.0


**ES Modules**
- probe.gl is used to test transition to ES Modules for all the vis.gl frameworks including deck.gl.
- You are welcome report any issues in the probe.gl repo.

**`@probe.gl/bench`**
- `Bench.add()` / `Bench.addAsync()` - The number of overloads has been reduced so some existing benchmark suites may need to be updated. When specifying priority and options, simply supply a property object instead of position arguments.
- Custom logging
    - the type of each `LogEntry` is now controlled by the `type` field instead of the `entry` field.
    - For `LogEntry.type`, the LOG_ENTRY export is removed in favor of simple string constants.

**`probe.gl`**
- The `probe.gl` "umbrella" module is no longer available as of 4.0. Simply replace `probe.gl` with the scoped `@probe.gl/...` modules you are actually using.

## Upgrading to v3.5 

- From v3.5, the `probe.gl` module is being deprecated in favor of importing sub modules `@probe.gl/...`. 
- The `probe.gl` module may be removed in probe.gl v4.0, but for backwards compatibility, this module will still be present in v3.x.
- `probe.gl` no longer contains any code, it just re-exports from `@probe.gl/env`, `@probe.gl/log`, `@probe.gl/stats`.

To upgrade:
- `import 'probe.gl` should be replaced with `import '@probe.gl/env'`, `import '@probe.gl/log'` and/or `import '@probe.gl/stats'` (depending on which imports you are using.).
- Update your `package.json` file(s) to install the submodules instead of the main module.
- The `import 'probe.gl/env` subdirectory import should be replaced with `import '@probe.gl/env'` (note the leading `@` sign). The subdirectory import is occasionally causing problems with bundlers and the submodule import should be more robust.
