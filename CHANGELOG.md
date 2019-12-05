CHANGELOG

v3.2.0-beta.3 - Dec 5, 2019

- fix transpilation (#117)

v3.2.0-beta.1 - Dec 5, 2019

- @probe.gl/stats: New module for Stats object (#101)
- Move seer to probe.gl (#104)
- improve log perf (#107)
- Remove rest parameters from Log class (#109)
- Rename `log.priority` to `log.level` (#114)
- Change default `enabled` behavior of Log class (#115)
- fix stat (#116)

v3.1.1 - Sep 19, 2019

- Fix stat object - update lastTiming (#102)

v3.1.0 - Sep 13, 2019

- bump version for examples

v3.1.0-beta.3 - Sep 6, 2019

v3.1.0-beta.2 - Sep 6, 2019

v3.1.0-beta.1 - Sep 6, 2019

- Bump mixin-deep from 1.3.1 to 1.3.2 (#96)
- Update to latest ocular-gatsby (#95)

v3.1.0-alpha.11

- Make Stats class accept stats in constructor (#92)
- Update widget when setStats (#93)

v3.1.0-alpha.10 - Aug 24, 2019

- Fix StatsWidget tracking compatible with old Stats class (#91)
- Compatible with old Stats (#90)
- Bump lodash.template from 4.4.0 to 4.5.0 (#81)
- Bump lodash from 4.17.11 to 4.17.15 (#89)

v3.1.0-alpha.9 Aug 23, 2019

v3.1.0-alpha.8 Aug 23, 2019

- refactor stats widget - simply the constructor API (#88)
- expose input event API (#83)

v3.1.0-alpha.7 - Jul 12, 2019

- Fix the document checking (#80)
-  Fix document crash in node (#79)

v3.1.0-alpha.6 - Jul 11, 2019

v3.1.0-alpha.5 - Jul 3, 2019
 
v3.1.0-alpha.4 - Jul 3, 2019
 
v3.1.0-alpha.3 - Jul 3, 2019

- Fix the document checking (#80)
- Fix document crash in node (#79)

v3.1.0-alpha.2 - May 30, 2019

- Bump ocular-dev-tools to publish LICENSE (#77)

v3.1.0-alpha.1 - May 24, 2019

- Upgrade ocular-dev-tools (#75)
- fix crash on newer chromium versions (#74)
- Improve BrowserDriver error handling (#71)
- Sample window (#70)
- Add gatsby website (#69)

v3.0.1 - Apr 2, 2019

- Bump ocular-dev-tools@0.0.19 (#66)

v3.0.0-alpha.9 - Apr 1, 2019

- Merge branch 'fix-dynamic-widget'

v3.0.0-alpha.8 - Apr 1, 2019

- Fix dynamic dom creation

v3.0.0-alpha.7 - Mar 13, 2019

- Simplified StatsWidget API
- `Stats.getTable` method to format stats in a way suitable for `console.table`

v2.2.0-beta.1 - Jan 30, 2019

- Browser test tools

v2.0.1 - Oct 9, 2018
v2.0.0 - Oct 9, 2018

v2.0.0-beta.4 - Sep 22, 2018

- Fix `assert` export

v2.0.0-beta.3 - Sep 20, 2018

- Add `esnext` target

v2.0.0-beta.2 - Sep 20, 2018

- Introduce @babel/runtime and multiple dists

v2.0.0-beta.1 - Aug 28, 2018

- `asciify-image` again not a depedency, due to installing 90+ subdependencies.

v2.0.0-alpha.1 - Aug 19, 2018

- Export utils for global symbols and environment detection
- Add basic browser/mobile detection
- Adopt new experimental exports scheme

v1.1.0-alpha.1 - Aug 1, 2018

- `sideEffects` flag added to `package.json` to improve tree-shaking performance
- `asciify-image` again a dependency (since it has cleaned up their dependencies).
- "browser" field in package.json used to ensure latest webpack doesn't bundle `asciify-image`.

v1.0.2 - May 23, 2018

- Log.probe now only logs same string once, as intended
- Remove asciify-image dependency (to avoid recursive npm dep)

v1.0.1 - May 3, 2018

- Image logging improvements

v1.0.0 - Apr 16, 2018

- Initial official release

## Old Prereleases

v1.0.0-alpha.11

- `spy.returns` method added
- Server start retry logic to handle port in use case.

v1.0.0-alpha.10

- bundle size tests
- no longer use external assert

v1.0.0-alpha.9

- not stop server when failed

v1.0.0-alpha.8

- default log export
- `Log.probe`
- `Stats` class improvements

v1.0.0-alpha.7

- probe timings

v1.0.0-alpha.6

- Experimental image utils
- new Stats class
- Browser automation BrowserTestDriver
- experimental image utils

v1.0.0-alpha.5

- fix console logging

v1.0.0-alpha.4

- Support saving probe config in local storage
- Doc improvements

v1.0.0-alpha.3

- Fix groupEnd issue under Node.js

v1.0.0-alpha.2

- Support functions that generate messages: log.log(() => `message ${message}`)
- Support `log.table`

v1.0.0-alpha.1

- Move to 1 series releases, to support use in luma.gl and deck.gl

v0.2.2

- Disable babel-preset-env temporarily as it requires upstream deps to follow

v0.2.1

- Remove dist-es6 completely

v0.2.0

- `NodeTestDriver` renamed to `BrowserDriver`
- Fixes to Log class
- Fixes to build scripts

v0.1.0

- Remove `bench` and `test` from main index.js, require separate imports.
- `Spy` renamed to `makeSpy`, final call.
- Improved test structure

v0.0.7

- Fix naming of test exports

v0.0.6

- Fix triple exports

v0.0.5

- Split into three exports (import 'probe.gl', import 'probe.gl/bench', import 'probe.gl/test')
- New `NodeTestDriver` class
- {color: ...} option for Node.js

v0.0.4

- Markdown report option
- Bench test case priorities
- FIX: Cap iteration count for long running test cases (regression)

v0.0.3

- Bench: Initial regression testing, local storage
- Log: Initial rewrite to return log functions, enabling source links

v0.0.2

- Async benchmarking, improved DOM logging

v0.0.1

- `Bench` and `Log` classes added.

v0.0.0

- probe.gl is now open source. We'll keep it in 0.x version for a while until the API is stable.
