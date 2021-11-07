# Upgrade Guide

## Upgrading to v3.5 

- From v3.5, the original `probe.gl` module is being deprecated in favor of new sub modules. 
- The `probe.gl` module will be removed in probe.gl v4.0, but for backwards compatiblity, this module is still present in v3.x.
- `probe.gl` is now an empty module that just imports and re-exports symbols from `@probe.gl/env`, `@probe.gl/log`, `@probe.gl/stats`.

To upgrade:
- `import 'probe.gl` should be replaced with `import '@probe.gl/env'`, `import '@probe.gl/log'` and/or `import '@probe.gl/stats'` (depending on which imports you are using.).
- Update your `package.json` files to install the submodules instead of the main module.
- The `import 'probe.gl/env` subdirectory import should be replaced with `import '@probe.gl/env'` (note the leading `@` sign). The subdirectory import is occasionally causing problems with bundlers and the submodule import should be more robust.
