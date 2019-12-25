# What's New

## v3.x

Release Date: TBD

### **@probe.gl/bench**
- New bench case option: `repetitions`

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
