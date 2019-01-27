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
});
```

In your script that is run on the browser:
```js
// This is the script that runs in Node.js and starts the browser
import {callExposedFunction} from 'probe.gl/test-utils';
// Log to terminal console
callExposedFunction('browserTestLog', 'Test started');
...
// App is done running, terminate the browser instance
callExposedFunction('browserTestComplete', {success: true});
```


## Methods

### constructor

Creates a `BrowserTestDriver` instance.

`new BrowserTestDriver()`


### run

`renderTestDriver.run(config)`

Runs the tests:
* starts a Chrome browser instance,
* starts a server (e.g. a webpack-dev-server) that bundles a test script.
* the test script renders a set of tests (described below), compares the output against golden images
* closes down all processes and browser tabs.
* the test script returns a pass/fail value to the `BrowserTestDriver` which ultimately passes back a `0` (success) or `1` failure to the invoking shell.

Parameters:

* `config` (Object)
  - `title` (String) - name of the test
  - `parameters` (Array<String>) - parameters to pass to the dev server prodcess
  - `puppeteer` (Object) - options for the Puppeteer instance, default `{headless: false}`.
  - `exposeFunctions` (Object) - keys are function names to be added to the page's `window` object, and the values are callback functions to execute in Node.js. This object will be merged with the following default callbacks:
    + `browserTestLog` - logs to Node console
    + `browserTestComplete` - declare the test is complete and the Puppeteer instance can be safely terminated. Expects an argument `{sucess: true|false}` which will be used to determine if the test has passed.

  For more information, see [exposeFunction](https://github.com/GoogleChrome/puppeteer/blob/v1.11.0/docs/api.md#pageexposefunctionname-puppeteerfunction).
