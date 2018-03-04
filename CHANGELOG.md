CHANGELOG

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
