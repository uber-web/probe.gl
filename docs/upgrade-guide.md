# Upgrade Guide

## Upgrading to v4.0

- The `probe.gl` "umbrella" module is no longer available as of 4.0, per the previously announced deprecation plan. Simply replace `probe.gl` with the scoped `@probe.gl/...` modules you are actually using.

## Upgrading to v3.5 

- From v3.5, the `probe.gl` module is being deprecated in favor of importing sub modules `@probe.gl/...`. 
- The `probe.gl` module may be removed in probe.gl v4.0, but for backwards compatibility, this module will still be present in v3.x.
- `probe.gl` no longer contains any code, it just re-exports from `@probe.gl/env`, `@probe.gl/log`, `@probe.gl/stats`.

To upgrade:
- `import 'probe.gl` should be replaced with `import '@probe.gl/env'`, `import '@probe.gl/log'` and/or `import '@probe.gl/stats'` (depending on which imports you are using.).
- Update your `package.json` file(s) to install the submodules instead of the main module.
- The `import 'probe.gl/env` subdirectory import should be replaced with `import '@probe.gl/env'` (note the leading `@` sign). The subdirectory import is occasionally causing problems with bundlers and the submodule import should be more robust.
