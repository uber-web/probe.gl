# CHANGELOG

## v4.0.7

- chore(build): Upgrade ocular-dev-tools (#249)

## v4.0.6

- feat(test-utils): add onStart/onFinish callbacks to BrowserTestDriver (#248)
- fix(log): side effect declaration (#247)

## v4.0.5

- [test-utils] Upgrade puppeteer (#244)

## v4.0.4

-  Update babel config (#237)

## v4.0.3

- feat(test-utils) BrowserDriver support custom server implementation (#235)

## v4.0.2

- Fix globals bundle error (#229)
- Fix peerDependency versions (#228)

## v4.0.1

- Fix Stats.get typing (#227)

## v4.0.0

- chore(bench): Flatten internal structures, simplify typing (#223)
- chore(test-utils): Strict null checks (#222)

## v4.0.0-alpha.1 - Jan 1, 2023

- chore(bench): Enable all typescript checks on `bench` module (#220)
- chore: Enable all available typescript checks to selected modules (#219)
- chore: reduce use of implicit any (#218)
- fix(stats-widget): stat widget style handling and restore test (#217)
- chore: Bump lerna to 4.0.0-alpha.0 (#216)
- Use pure ES modules (v4) (#215)
- chore: remove asciify-image dependency (#214)
- chore: stricter typescript settings (#213) 

## v3.6.0 - Jan 1, 2023

- chore(log): remove asciify-image dependency (#214)
- chore: stricter typescript settings (#213)
## v3.5.4 - Dec 18, 2022

- fix(bench) Fix logging (#212)

## v3.5.3 - Dec 18, 2022

- feat(test-utils) BrowserTestDriver supports relative url (#211)

## v3.5.2 - Aug 18, 2022

- chore: Convert examples from webpack to vite (#200)
- fix(log): vite build error re nodeAsciifyImage (#199)

- build(deps): bump eventsource from 1.1.0 to 1.1.2 (#201)
- build(deps): bump parse-url from 6.0.0 to 6.0.5 (#198)
- build(deps): bump terser from 4.8.0 to 4.8.1 (#195)
- build(deps-dev): bump jsdom from 15.2.1 to 16.5.0 (#193)
- build(deps): bump async from 2.6.3 to 2.6.4 (#190)
- build(deps): bump url-parse from 1.5.3 to 1.5.10 (#189)
- build(deps): bump follow-redirects from 1.14.5 to 1.14.8 (#186)

## v3.5.1 - Aug 10, 2022

 - fix(log): "quarantine" dynamic import of asciify-image (#197)
 - feat(log): More robust typings for log.assert. (#188)
 - fix(log): Correct title in README.md

## v3.5.0 - Dec 12, 2022
  NO CHANGES

## v3.5.0-alpha.5 - Nov 17, 2021

- chore(log): Improved typings for `Log` class (#183)
- feat(env): Return string constants (#184)

## v3.5.0-alpha.4 - Nov 15, 2021

- fix(test-utils): Disable puppeteer timeout (#182)
- chore: "Add CI for Node 16 (#181)
- chore: BrowserTestDriver async syntax (#180)
- fix(website): unbreak website (#179)

## v3.5.0-alpha.3 - Nov 7, 2021
## v3.5.0-alpha.2 - Nov 7, 2021

- feat: enable .d.ts builds
- Stats widget: Header cursor (#167)
- chore: improve TS types across the code base (#176)
- chore: Monorepo setup for typescript (#175)
- chore: split out env and log modules (#174)
- chore: test utils to .ts (#172)
- chore: more .ts files (#170)
- chore: Convert to .ts files (#169)
- chore: `modules/core` -> `modules/main` (#168)

## v3.5.0-alpha.1 - Oct 20, 2021

- Add collapse option to StatsWidget (#166)
- chore(stats-widget): Convert module to .ts (#164)
- chore: Bump to ocular-dev-tools@1.0.0-alpha.7 to prep for typescript (#163)
- chore: Migrate to Github Actions (#162)
- fix(stats): stats getTable type (#161)

## v3.4.1 - Sep 7, 2021

- [feat] expose maxConsoleMessageLength (#160)
- [fix] broken createDiffImage option (#159)

## v3.4.0 - Jul 16, 2021

## v3.4.0-beta.2 - Jul 3, 2021

- Add types entry to package.json (#155)
- [TypeScript] fix Spy interface (#153)

## v3.4.0-beta.1 - Jul 1, 2021

- typescript type definitions (#139)
- Update build targets (#148)

## v3.3.1 - Feb 12, 2021

- Use latest puppeteer (#140)

## v3.3.0 - Jun 18, 2020

## v3.3.0-alpha.6 - Mar 25, 2020

- remove examples from workspaces to unblock publish

## v3.3.0-alpha.5 - Mar 25, 2020

- react-bench: New module providing UI for @probe.gl/bench benchmarks (#127)

## v3.3.0-alpha.4 - Jan 28, 2020

- Remove isHeadless from polyfill (#126)
- [test-utils] Add polyfill (#124)
- [test-utils] Add option to exclude empty pixels in screenshot di… (#125)

## v3.3.0-alpha.3 - Jan 5, 2020

- bench: Minor fixes (#123)

## v3.3.0-alpha.2 - Jan 3, 2020

- bench: Fixes for `options._throughput` (#122)

## v3.3.0-alpha.1 - Dec 31, 2019

- bench: Add `options._throughput` to run async tests in parallel (#121)
- bench: Add `options.repetitions` to tests for more meaningful metrics reporting (#120)
- bench: Join sync and async runner code paths (#119)
- Bump webpack-dev-server from 2.11.5 to 3.8.2 in /extensions/seer (#106)
- Bump serialize-javascript from 1.9.1 to 2.1.1 in /extensions/seer (#113)

## v3.2.0-beta.3 - Dec 5, 2019

- fix transpilation (#117)

## v3.2.0-beta.1 - Dec 5, 2019

- @probe.gl/stats: New module for Stats object (#101)
- Move seer to probe.gl (#104)
- improve log perf (#107)
- Remove rest parameters from Log class (#109)
- Rename `log.priority` to `log.level` (#114)
- Change default `enabled` behavior of Log class (#115)
- fix stat (#116)

## v3.1.1 - Sep 19, 2019

- Fix stat object - update lastTiming (#102)

## v3.1.0 - Sep 13, 2019

- bump version for examples

## v3.1.0-beta.3 - Sep 6, 2019

## v3.1.0-beta.2 - Sep 6, 2019

## v3.1.0-beta.1 - Sep 6, 2019

- Bump mixin-deep from 1.3.1 to 1.3.2 (#96)
- Update to latest ocular-gatsby (#95)

## v3.1.0-alpha.11

- Make Stats class accept stats in constructor (#92)
- Update widget when setStats (#93)

## v3.1.0-alpha.10 - Aug 24, 2019

- Fix StatsWidget tracking compatible with old Stats class (#91)
- Compatible with old Stats (#90)
- Bump lodash.template from 4.4.0 to 4.5.0 (#81)
- Bump lodash from 4.17.11 to 4.17.15 (#89)

## v3.1.0-alpha.9 Aug 23, 2019

## v3.1.0-alpha.8 Aug 23, 2019

- refactor stats widget - simply the constructor API (#88)
- expose input event API (#83)

## v3.1.0-alpha.7 - Jul 12, 2019

- Fix the document checking (#80)
-  Fix document crash in node (#79)

## v3.1.0-alpha.6 - Jul 11, 2019

## v3.1.0-alpha.5 - Jul 3, 2019
 
## v3.1.0-alpha.4 - Jul 3, 2019
 
## v3.1.0-alpha.3 - Jul 3, 2019

- Fix the document checking (#80)
- Fix document crash in node (#79)

## v3.1.0-alpha.2 - May 30, 2019

- Bump ocular-dev-tools to publish LICENSE (#77)

## v3.1.0-alpha.1 - May 24, 2019

- Upgrade ocular-dev-tools (#75)
- fix crash on newer chromium versions (#74)
- Improve BrowserDriver error handling (#71)
- Sample window (#70)
- Add gatsby website (#69)

## v3.0.1 - Apr 2, 2019

- Bump ocular-dev-tools@0.0.19 (#66)

## v3.0.0-alpha.9 - Apr 1, 2019

- Merge branch 'fix-dynamic-widget'

## v3.0.0-alpha.8 - Apr 1, 2019

- Fix dynamic dom creation

## v3.0.0-alpha.7 - Mar 13, 2019

- Simplified StatsWidget API
- `Stats.getTable` method to format stats in a way suitable for `console.table`

## v2.2.0-beta.1 - Jan 30, 2019

- Browser test tools

## v2.0.1 - Oct 9, 2018
## v2.0.0 - Oct 9, 2018

## v2.0.0-beta.4 - Sep 22, 2018

- Fix `assert` export

## v2.0.0-beta.3 - Sep 20, 2018

- Add `esnext` target

## v2.0.0-beta.2 - Sep 20, 2018

- Introduce @babel/runtime and multiple dists

## v2.0.0-beta.1 - Aug 28, 2018

- `asciify-image` again not a depedency, due to installing 90+ subdependencies.

## v2.0.0-alpha.1 - Aug 19, 2018

- Export utils for global symbols and environment detection
- Add basic browser/mobile detection
- Adopt new experimental exports scheme

## v1.1.0-alpha.1 - Aug 1, 2018

- `sideEffects` flag added to `package.json` to improve tree-shaking performance
- `asciify-image` again a dependency (since it has cleaned up their dependencies).
- "browser" field in package.json used to ensure latest webpack doesn't bundle `asciify-image`.

## v1.0.2 - May 23, 2018

- Log.probe now only logs same string once, as intended
- Remove asciify-image dependency (to avoid recursive npm dep)

## v1.0.1 - May 3, 2018

- Image logging improvements

## v1.0.0 - Apr 16, 2018

- Initial official release

## Old Prereleases

## v1.0.0-alpha.11

- `spy.returns` method added
- Server start retry logic to handle port in use case.

## v1.0.0-alpha.10

- bundle size tests
- no longer use external assert

## v1.0.0-alpha.9

- not stop server when failed

## v1.0.0-alpha.8

- default log export
- `Log.probe`
- `Stats` class improvements

## v1.0.0-alpha.7

- probe timings

## v1.0.0-alpha.6

- Experimental image utils
- new Stats class
- Browser automation BrowserTestDriver
- experimental image utils

## v1.0.0-alpha.5

- fix console logging

## v1.0.0-alpha.4

- Support saving probe config in local storage
- Doc improvements

## v1.0.0-alpha.3

- Fix groupEnd issue under Node.js

## v1.0.0-alpha.2

- Support functions that generate messages: log.log(() => `message ${message}`)
- Support `log.table`

## v1.0.0-alpha.1

- Move to 1 series releases, to support use in luma.gl and deck.gl

## v0.2.2

- Disable babel-preset-env temporarily as it requires upstream deps to follow

## v0.2.1

- Remove dist-es6 completely

## v0.2.0

- `NodeTestDriver` renamed to `BrowserDriver`
- Fixes to Log class
- Fixes to build scripts

## v0.1.0

- Remove `bench` and `test` from main index.js, require separate imports.
- `Spy` renamed to `makeSpy`, final call.
- Improved test structure

## v0.0.7

- Fix naming of test exports

## v0.0.6

- Fix triple exports

## v0.0.5

- Split into three exports (import 'probe.gl', import 'probe.gl/bench', import 'probe.gl/test')
- New `NodeTestDriver` class
- {color: ...} option for Node.js

## v0.0.4

- Markdown report option
- Bench test case priorities
- FIX: Cap iteration count for long running test cases (regression)

## v0.0.3

- Bench: Initial regression testing, local storage
- Log: Initial rewrite to return log functions, enabling source links

## v0.0.2

- Async benchmarking, improved DOM logging

## v0.0.1

- `Bench` and `Log` classes added.

## v0.0.0

- probe.gl is now open source. We'll keep it in 0.x version for a while until the API is stable.
