# BrowserDriver (Test Automation Class)

<p class="badges">
  <img src="https://img.shields.io/badge/Node.js-v8.0+-blue.svg?style=flat-square" alt="Node" />
  <img src="https://img.shields.io/badge/Chrome-v64+-blue.svg?style=flat-square" alt="Node" />
</p>

A Chrome Browser test automation driver class (based on the [Chrome `DevTools` protocol](https://chromedevtools.github.io/devtools-protocol/) via the [`puppeteer`](https://github.com/GoogleChrome/puppeteer) module. The `BrowserDriver` class is primarily intended for automating browser based applications from shell scripts.

A `BrowserDriver` is typically used to do the following:
* Launch/close a Chromium browser instance
* Start/stop a local web service.
* Opens a browser page with a URL in the browser.

To use this class, [puppeteer](https://www.npmjs.com/package/puppeteer) must be installed as a dev dependency.

## Usage

```js
const {BrowserDriver} = require('@probe.gl/test-utils');
new BrowserDriver({id: 'browser-test'});
```


## Constructor

```js
const browserDriver = new BrowserDriver(opts);
```

Parameters:

* `opts` (Object)
  - `id` (String) - an id for this `BrowserDriver` instance. Default `browser-driver`.


## Methods

### `startBrowser(options : Object)`

Launch a new browser instance.

`options` are directly passed to [puppeteer.launch](https://github.com/GoogleChrome/puppeteer/blob/v1.11.0/docs/api.md#puppeteerlaunchoptions).

Returns a `Promise` that resolves when the browser has started.

### `openPage(options : Object)`

Open a new tab in the browser. Only works after a browser instance is started:

```js
browserDriver.startBrowser().openPage({url: 'http://localhost'});
```

