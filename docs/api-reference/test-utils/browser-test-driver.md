<p class="badges">
  <img src="https://img.shields.io/badge/Node.js-v8.0-blue.svg?style=flat-square" alt="Node" />
</p>

# BrowserTestDriver (Test Automation Class)

> Requires Chrome version 64 or higher

A higher level helper class (compared to the [`BrowserDriver`](./docs/api-reference/test/browser-task-status) class.) primarily intended for automating browser tests from Node.js shell scripts.

A `BrowserTestDriver` starts a Chrome browser instance and a server and opens a page with a URL that loads a script from the server. The script that runs in the browser is expected to report status back using the [`callExposedFunction`](./docs/api-reference/test/browser-task-status) class.


## Usage

In your node.js start script:
```js
// This is the script that runs in Node.js and starts the browser
const {BrowserTestDriver} = require('probe.gl/test-utils');
new BrowserTestDriver().run({
  process: 'webpack-dev-server',
  parameters: ['--env.browser-test'],
  exposeFunction: 'testDone'
});
```

In your script that is run on the browser:
```js
// This is the script that runs in Node.js and starts the browser
import {callExposedFunction} from 'probe.gl/test-utils';
...
callExposedFunction('testDone', {success: true});
```


## Methods

### constructor

Creates a `BrowserTestDriver` instance.

`new BrowserTestDriver()`


### run

`renderTestDriver.run()`

Runs the tests:
* starts a Chrome browser instance,
* starts a server (e.g. a webpack-dev-server) that bundles a test script.
* the test script renders a set of tests (described below), compares the output against golden images
* closes down all processes and browser tabs.
* the test script returns a pass/fail value to the `BrowserTestDriver` which ultimately passes back a `0` (success) or `1` failure to the invoking shell.
