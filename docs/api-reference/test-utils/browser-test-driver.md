# BrowserTestDriver (Test Automation Class)

<p class="badges">
  <img src="https://img.shields.io/badge/Node.js-v8.0-blue.svg?style=flat-square" alt="Node" />
</p>

> Note: Requires Chrome version 64 or higher

A higher level helper class that inherits the [`BrowserDriver`](./docs/api-reference/test/browser-task-status). Primarily intended for automating browser tests from Node.js shell scripts.

A `BrowserTestDriver` starts a Chromium browser instance and a server and opens a page with a URL that loads a script from the server. The script that runs in the browser is expected to report test results back using predefined global functions.

To use this class, [puppeteer](https://www.npmjs.com/package/puppeteer) must be installed as a dev dependency.

## Usage

In your node.js start script:

```js
// This is the script that runs in Node.js and starts the browser
const {BrowserTestDriver} = require('probe.gl/test-utils');
new BrowserTestDriver().run({
  server: {
    command: 'webpack-dev-server',
    arguments: ['--env.browser-test']
  },
  headless: true
});
```

In your script that is run on the browser:

```js
// Run test cases
...
// App is done running, terminate the browser instance
window.browserTestDriver_sendMessage('done', 'All tests passed');
```


## Constructor

```js
const browserTestDriver = new BrowserTestDriver(opts);
```

Parameters:

* `opts` (Object)
  - `id` (String) - an id for this `BrowserTestDriver` instance. Default `browser-driver`.


## Methods

### run(config : Object)

Runs the tests:

* Starts a Chromium browser instance.
* Starts a dev server, e.g. a webpack-dev-server that bundles a test script.
* Opens a browser page to run the test script.
* Extracts test reports from the browser back into node
* Closes browser, server and terminates the current node script.
* Passes an exit status (e.g. pass/fail) back to the invoking shell.

Parameters:

* `title` (String) - name of the test, e.g. `'Unit tests'`. Default `'Browser Test'`.
* `headless` (Boolean) - whether to run the test in headless mode. If `true`, all console outputs from the test app will be piped to the shell. If `false`, the browser window will remain open in case any test fails.
* `server` (Object|Function|`false`)
  - If an object is supplied: used as options to create a dev server. Passed to [BroserDriver.startServer](/docs/api-reference/test-utils/browser-driver.md).
  - If a function is supplied: will be called to create a dev server. Should return a `Promise` that resolves to the service URL.
  - If `false`: no dev server.
* `browser` (Object) - options to user for creating the Puppeteer instance. Passed to [BroserDriver.startBrowser](/docs/api-reference/test-utils/browser-driver.md).
* `exposeFunctions` (Object) - keys are function names to be added to the page's `window` object, and the values are callback functions to execute in Node.js. See [exposeFunction](https://github.com/GoogleChrome/puppeteer/blob/v1.11.0/docs/api.md#pageexposefunctionname-puppeteerfunction) for details.
* `url` (String) - if supplied, will be used instead of the URL returned by the dev server.


## Built-in Exposed Functions

The `BrowserTestDriver` instance exposes a series of global functions to the browser application.
The following functions can be called from the browser application to communicate with the nodejs script:

### browserTestDriver_sendMessage(type : String, args: Any)

#### fail

```js
window.browserTestDriver_sendMessage('fail');
```

Notify the node script that some test has failed.

#### done

```js
window.browserTestDriver_sendMessage('done', 'custom message');
```

Notify the node script that the app has finished executing and the browser should be closed.

### browserTestDriver_captureAndDiffScreen(options : Object)

```js
window.browserTestDriver_captureAndDiffScreen({
  goldenImage: './golden-images/map.png',
  region: {x: 0, y: 0, width: 800, height: 600},
  threshold: 0.99
});
```

Request an pixel diff between the current page and a reference "golden image." This can be used to verify that the page is visually rendered as expected.

* `goldenImage` (String) - path to the golden image, relative to the directory where the shell command is executed
* `region` (Object, optional) - a bounding box to take a screenshot of. In shape of `{x, y, width, height}` relative to the page. If not specified, will take a screenshot of the whole page.
* `threshold` (Number, optional) - the match rate for the test to pass. Between `0` (no pixels matched) to `1` (all pixels matched). Default `0.99`.
* `tolerance` (Number, optional) - the tolerance during pixel matching. Between `0` (strict match) to `1` (anything will pass). Default `0.1`.
* `includeAA` (Boolean, optional) - If `true`, all pixels are compared. Otherwise detect and ignore anti-aliased pixels. Default `false`.
* `createDiffImage` (Boolean, optional) - if `true`, will generate binary image data that highlight the mismatched pixels.

Returns: a `Promise` that resolves to an object with the following fields:

* `success` (Boolean) - whether the test passed. A test can fail either because the match rate is lower than the specified `threshold`, or an unexpected error occurred.
* `match` (Number) - the result match rate. Between `0` (no pixels matched) to `1` (all pixels matched).
* `matchPercentage` (String) - `match` formatted in percentage form.
* `diffImage` (Uint8Array) - image data that highlight the mismatched pixels. Only if `createDiffImage: true`.
* `error` (String) - error message if any.
