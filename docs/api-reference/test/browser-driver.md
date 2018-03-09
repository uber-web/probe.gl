<p class="badges">
  <img src="https://img.shields.io/badge/Node.js-v8.0-blue.svg?style=flat-square" alt="Node" />
</p>

# BrowserDriver

> Note: Requires Chrome version 64 or higher

A Chrome Browser test automation driver class (based on the [Chrome `DevTools` protocol](https://chromedevtools.github.io/devtools-protocol/) via the [`puppeteer`](https://github.com/GoogleChrome/puppeteer) module. The `BrowserDriver` class is primarily intended for automating runs of browser based tests from shell scripts.

A `BrowserDriver` is typically used to do the following:
* Start a Chrome browser instance
* Start a (webpack) dev server that builds a bundle of a JavaScript code to execute in the browser.
* Opens a browser page with a URL that loads the bundle into the browser and runs the tests.
* Extracts a pass/fail value from the browser back into node
* Closes browser, server and terminates the current node script.
* Passes the pass/fail value as exit status (0/1) back to the invoking shell.



### constructor

`new BrowserDriver({...})`

### startBrowser

`driver.startBrowser(options)`

Returns a `Promise` that resolves when the browser has started.


### newPage

Opens a new tab in the browser

`driver.newPage({url, width, height})`

* `url` = `http://localhost:8080` - The url to load in the page.
* `width` = `1550` - The width of the page
* `height` = `850` - The height of the page
Returns a `Promise` that resolves when the page is open.


### exposeFunction

Exposes a function on the `window` object in the controlled browser and waits until the controlled script has called that function. In addition, a string parameter to the function will be returned (as the value of the resolved `Promise`).

`driver.exposeFunction(functionToExpose)`

* `functionToExpose`=`sendMessage` (`String`)
Returns: a `Promise` that resolves when the browser code calls the function to the string the browser script passed to the exposed function.


### stopBrowser

Stops and closes the browser.

`driver.stopBrowser()`

Returns a `Promise` that resolves when the browser is closed.


### setShellStatus

`driver.setShellStatus(success)`

Set the return value that will be visible to the shell, truthy values will generate 0 which represents success.


### startServer

Runs a server in a new child process, that the browser can connect to.

`driver.startServer({process, parameters, options})`

* `process`=`'./node_modules/.bin/webpack-dev-server'` - The process to fork
* `parameters`=`['--config', 'test/render/webpack.config.js']` - The parameters to the process
* `options`=`{maxBuffer: 5000 * 1024}`

Example:
```js
driver.startServer({
  process: './node_modules/.bin/webpack-dev-server',
  parameters: ['--config', 'test/render/webpack.config.js'],
  options: {maxBuffer: 5000 * 1024}
})
```

Returns: nothing


### stopServer

Stopsthe server (kills the child process)

`driver.stopServer()`

Returns: nothing


### exit

Stops all started sub processes and terminates current script. Generates a return value that is visible to the shell, `0` is success.

`driver.exit(...)`

Notes:
* Stops the browser via `this.stopBrowser()`.
* Stops the server (child process), via `this.stopServer()`.
* Exits the current script with a status code.

