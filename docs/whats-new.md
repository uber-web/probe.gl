# What's New

## v3.5

Release Date: Dec 12, 2021

- TypeScript: exported `.d.ts` files are now more robust (automatically built from source `.ts` files).

### `@probe.gl/env` (NEW MODULE)

- The environment functionality from the now deprecated `probe.gl` module (global exports, `isBrowser`, `isElectron` etc.)  have been moved to this module.

### `@probe.gl/log` (NEW MODULE)

- The `Log` and `COLOR` classes from the now deprecated `probe.gl` module.

### `@probe.gl/stats-widget`

- Add collapse option
- Use pointer cursor in header

### `probe.gl`

- The original `probe.gl` module is now fully deprecated in favor of scoped submodules and will be removed in probe.gl v4.0.
- For backwards compatiblity, `the probe.gl` module imports and re-exports symbols from `@probe.gl/env`, `@probe.gl/log`, `@probe.gl/stats`.
- See our [Upgrade Guide](./upgrade-guide.md) for more details.

## v3.4

Release Date: Jul 16, 2021

- Exports TypeScript type definitions for all probe.gl modules.
## v3.3

Release Date: Jun 18, 2020

### `@probe.gl/bench`
- New options for `Bench` benchmarks: `options.multiplier`, `options.units`, `options._throughput`

### `@probe.gl/react-bench`
- New module with a react-component that displays the result of `Bench` runs.

## v3.2

Release Date: Dec 16, 2019

New modules
- `@probe.gl/stats` New module enabling users to import `Stats` object only
- `@probe.gl/seer` Seer repository moved into probe.gl monorepo.

`@probe.gl/log`: `Log` class improvements
- Rename `log.priority` to `log.level`
- Change default `enabled` behavior of Log class
- Improve log perf
- Remove rest parameters from Log class

## v3.1

Release Date: Sep 13, 2019

### **probe.gl**

- `Stats` - Stats objects can now be constructed with a type hint for each stat. This is used to select default formatters for the stats.
- `StatsWidget` - Can now be created without a stats object, and the stats object can be replaced and unset.

### **@probe.gl/test-utils**

- Input event emulation API

### **@probe.gl/stats**

- New module exporting only the `Stats` and `Stat` objects.


## v3.0

Release Date: Apr 1, 2019

## Module split

The subfile import scheme has been replaced with proper npm modules:

* **probe.gl** - Log Class
* **@probe.gl/bench** - Benchmark utilities
* **@probe.gl/stats-widget** - UI widgets for profiling
* **@probe.gl/test-utils** - Integration test utilities

## Bench class

* **Benchmark async functions** - New method `Bench.addAsync`.

## Utilities

* New method `getHiResTimestamp` - Uses high res timer APIs in both browser and Node.


## v2.1

Release Date: Jan 2019

### Log class additions
- New method `log.assert()`
- New method `log.settings()`
- New method `log.set()`
- New method `log.get()`

## v1.0

probe.gl is now open source!
