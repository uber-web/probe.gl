<p class="badges">
  <img src="https://img.shields.io/badge/Node.js-v8.0-blue.svg?style=flat-square" alt="Node" />
</p>

# BrowserDriver (Test Automation Class)

> Note: Requires Chrome version 64 or higher

A Chrome Browser test automation driver class (based on the [Chrome `DevTools` protocol](https://chromedevtools.github.io/devtools-protocol/) via the [`puppeteer`](https://github.com/GoogleChrome/puppeteer) module. The `BrowserDriver` class is primarily intended for automating browser based applications from shell scripts.

A `BrowserDriver` is typically used to do the following:
* Launch/close a Chromium browser instance
* Start/stop a local web service.
* Opens a browser page with a URL in the browser.

To use this class, [puppeteer](https://www.npmjs.com/package/puppeteer) must be installed as a dev dependency.

## Usage

```js
import {BrowserDriver} from 'probe.gl/test-utils';
new BrowserDriver({id: 'browser-test'});
```


## Methods

### constructor

```js
const browserDriver = new BrowserDriver(opts);
```

Parameters:

* `opts` (Object)
  - `id` (String) - an id for this `BrowserDriver` instance. Default `browser-driver`.

### startBrowser(options)

Launch a new browser instance.

Parameters:

* `options` (Object) - options to pass to [puppeteer.launch](https://github.com/GoogleChrome/puppeteer/blob/v1.11.0/docs/api.md#puppeteerlaunchoptions).

Returns a `Promise` that resolves when the browser has started.

### openPage(options)

Open a new tab in the browser. Only works after a browser instance is started:

```js
browserDriver.startBrowser().openPage({url: 'http://localhost'});
```

Parameters:

* `options` (Object)
  - `url` (String) - The url to load in the page. Default `http://localhost`.
  - `exposeFunctions` (Object) - keys are function names to be added to the page's `window` object, and the values are callback functions to execute in Node.js. See [exposeFunction](https://github.com/GoogleChrome/puppeteer/blob/v1.11.0/docs/api.md#pageexposefunctionname-puppeteerfunction) for details.

Returns a `Promise` that resolves when the page is open.


### stopBrowser()

Terminate the browser instance.

Returns a `Promise` that resolves when the browser is closed.


### startServer(config)

Runs a server in a new child process, that the browser can connect to.

```js
driver.startServer({
  command: './node_modules/.bin/webpack-dev-server',
  arguments: ['--config', 'test/webpack.config.js'],
  wait: 2000
})
```

Parameters:

* `command` (String) - the command to run, default `'webpack-dev-server'`.
* `arguments` (Array<String>) - a list of string arguments.
* `options` (Object) - options for the new process. Default `{maxBuffer: 5000 * 1024}`. See [child_process.spawn](https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options) for details.
* `port` (`'auto'`|`false`) - `startServer` can attempt to bind the service to an available port if `port` is set to `'auto'`. In this case, the command receives additional arguments `--port <port>`. Default `'auto'`.
* `wait` (Number) - time in milliseconds to wait after executing the command. If any error is generated from the child process during this period, the `Promise` will reject. Otherwise, the service is considered available. Default `2000`.

Returns a `Promise` that resolves to the service URL when the server is available.


### stopServer()

Stops the server (kills the child process).

Returns: a `Promise` that resolves when the server is closed.


### exit(statusCode)

Exit the process after safely closing down any running browser and server instances.

Parameter:

* `statusCode` - the status code to use when exit the process. Default `0`.
