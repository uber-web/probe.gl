# BrowserTestDriver

<p class="badges">
  <img src="https://img.shields.io/badge/Node.js-v8.0-blue.svg?style=flat-square" alt="Node" />
  <img src="https://img.shields.io/badge/Chrome-v64+-blue.svg?style=flat-square" alt="Node" />
</p>

A higher level helper class that inherits the [`BrowserDriver`](/docs/modules/test-utils/browser-driver). Primarily intended for automating browser tests from Node.js shell scripts.

A `BrowserTestDriver` starts a Chromium browser instance and a server and opens a page with a URL that loads a script from the server. The script that runs in the browser is expected to report test results back using predefined global functions.

To use this class, [puppeteer](https://www.npmjs.com/package/puppeteer) and [pixelmatch](https://www.npmjs.com/package/pixelmatch) must be installed as dev dependencies.

## Usage

In your node.js start script:

```js
// This is the script that runs in Node.js and starts the browser
const {BrowserTestDriver} = require('@probe.gl/test-utils');
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
// Polyfill so that the bundle can execute in browsers not controlled by puppeteer
require('@probe.gl/test-utils/polyfill');
// Run test cases
...
// App is done running, terminate the browser instance
window.browserTestDriver_finish('All tests passed');
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
* `headless` (Boolean) - whether to run the test in headless mode. If `true`, all console outputs from the test app will be piped to the shell. If `false`, the browser window will remain open for debugging.
* `server` (Object|Function|`false`)
  - If an object is supplied: used as options to create a dev server. Passed to [BroserDriver.startServer](/docs/modules/test-utils/browser-driver).
  - If a function is supplied: will be called to create a dev server. Should return a `Promise` that resolves to the service URL.
  - If `false`: no dev server.
* `browser` (Object) - options to user for creating the Puppeteer instance. Passed to [BroserDriver.startBrowser](/docs/modules/test-utils/browser-driver).
* `exposeFunctions` (Object) - keys are function names to be added to the page's `window` object, and the values are callback functions to execute in Node.js. See [exposeFunction](https://github.com/GoogleChrome/puppeteer/blob/v1.11.0/docs/api.md#pageexposefunctionname-puppeteerfunction) for details.
* `url` (String) - if supplied, will be used instead of the URL returned by the dev server.
* `maxConsoleMessageLength` (Number) - used in `headless: true` mode to crop log messages that are piped to the console. Default `500`.

## Built-in Exposed Globals

The `BrowserTestDriver` instance exposes a series of global functions to the browser application.
The following functions can be called from the browser application to communicate with the nodejs script:

### browserTestDriver_fail()

```js
window.browserTestDriver_fail();
```

Notify the node script that some test has failed.

### browserTestDriver_finish(message : String)

```js
window.browserTestDriver_finish('Congratulations! All tests passed.');
```

Notify the node script that the app has finished executing and the browser should be closed.

### browserTestDriver_isHeadless

```js
if (window.browserTestDriver_isHeadless) {
  console.log('Test is running in headless mode');
}
```

Truthy if the current test environment is headless.


### browserTestDriver_captureAndDiffScreen(options : Object)

```js
window.browserTestDriver_captureAndDiffScreen({
  goldenImage: './golden-images/map.png',
  region: {x: 0, y: 0, width: 800, height: 600},
  threshold: 0.99
}).then(result => {
  // do something
});
```

Request a pixel diff between the current page and a reference "golden image." This can be used to verify that the page is visually rendered as expected.

* `goldenImage` (String) - path to the golden image, relative to the directory where the shell command is executed
* `region` (Object, optional) - a bounding box to take a screenshot of. In shape of `{x, y, width, height}` relative to the page. If not specified, will take a screenshot of the whole page.
* `threshold` (Number, optional) - the matching score for the test to pass. Between `0` (no pixels matched) to `1` (all pixels matched). Default `0.99`.
* `tolerance` (Number, optional) - the tolerance when comparing two pixels. Between `0` (strict color match) to `1` (anything will pass). Default `0.1`.
* `includeAA` (Boolean, optional) - If `true`, all pixels are compared. Otherwise detect and ignore anti-aliased pixels. Default `false`.
* `includeEmpty` (Boolean, optional) - If `true`, the matching score is calculated as a percentage of all pixels. If `false`, empty pixels (alpha 0) will be excluded, potentially make the score lower. Default `true`.
* `createDiffImage` (Boolean, optional) - if `true`, will generate binary image data that highlight the mismatched pixels. Default `false`.
* `saveOnFail` (Boolean, optional) - if `true`, any screenshots that failed to meet the target matching rate will be saved to disk for further investigation. Default `false`.
* `saveAs` (String, optional) - the filename to save the screenshot as. If the string contains `[name]`, it will be replaced by the golden image path. Default `[name]-failed.png`.

Returns: a `Promise` that resolves to an object with the following fields:

* `success` (Boolean) - whether the test passed. A test can fail either because the matching score is lower than the specified `threshold`, or an unexpected error occurred.
* `headless` (Boolean) - whether the browser was running in headless mode.
* `match` (Number) - the matching score. Between `0` (no pixels matched) to `1` (all pixels matched).
* `matchPercentage` (String) - `match` formatted in percentage form.
* `diffImage` (Uint8Array) - image data that highlight the mismatched pixels. Only if `createDiffImage: true`.
* `error` (String) - error message if any.


### browserTestDriver_emulateInput(event: Object)

```js
window.browserTestDriver_emulateInput({
  type: 'keypress',
  key: 's',
  ctrlKey: true
}).then(result => {
  // ctrl + S is pressed! do something
});
```

Dispatch an emulated user input to the page. The following event types are supported:

#### keypress

Press a key on the keyboard.

- `type: 'keypress'`
- `key` (String) - see https://github.com/GoogleChrome/puppeteer/blob/master/lib/USKeyboardLayout.js
- `delay` (Number) - the time between keydown and keyup. Default `0`.
- `shiftKey` (Boolean) - whether to press the key with the shift key down. Default `false`.
- `ctrlKey` (Boolean) - whether to press the key with the control key down. Default `false`.
- `metaKey` (Boolean) - whether to press the key with the meta key down. Default `false`.


#### click

Click the mouse at a given screen coordinate.

- `type: 'click'`
- `x` (Number) - the screen x of the click.
- `y` (Number) - the screen y of the click.
- `button` (String) - `'left'`, `'right'` or `'middle'`.
- `delay` (Number) - the time between mousedown and mouseup. Default `0`.
- `shiftKey` (Boolean) - whether to click with the shift key down. Default `false`.
- `ctrlKey` (Boolean) - whether to click with the control key down. Default `false`.
- `metaKey` (Boolean) - whether to click with the meta key down. Default `false`.


#### mousemove

Move the mouse to a given screen coordinate.

- `type: 'mousemove'`
- `x` (Number) - the screen x to move the pointer to.
- `y` (Number) - the screen y to move the pointer to.
- `steps` (Number) - how many intermediate mousemove events to generate, default `1`.


#### drag

Drag the mouse from a given screen coordinate to another.

- `type: 'drag'`
- `startX` (Number) - the screen x to drag from.
- `startY` (Number) - the screen y to drag from.
- `endX` (Number) - the screen x to drag to.
- `endY` (Number) - the screen y to drag to.
- `button` (String) - `'left'`, `'right'` or `'middle'`.
- `steps` (Number) - how many intermediate mousemove events to generate, default `1`.
- `shiftKey` (Boolean) - whether to drag with the shift key down. Default `false`.
- `ctrlKey` (Boolean) - whether to drag with the control key down. Default `false`.
- `metaKey` (Boolean) - whether to drag with the meta key down. Default `false`.
