<p class="badges">
  <img src="https://img.shields.io/badge/Node.js-v8.0-blue.svg?style=flat-square" alt="Node" />
</p>

# NodeTestDriver

> Note: Requires Chrome version 64 or higher

A Chrome Browser test automation driver class (based on the Chrome `DevTools` protocol via the `puppeteer` npm module). This class is primarily intended for automating runs of browser based tests from shell scripts.

A `NodeTestDriver` is typically configured to do the following:
* Starts a Chrome browser instance using `puppeter`
* Start a webpack dev server that builds a bundle of a JavaScriot test suite.
* Loads the bundle into the browser and runs the tests.
* Extracts a pass/fail value from the browser back into node
* Passes the pass/fail value as exit status (0/1) back to the invoking shell.



### constructor

`new NodeTestDriver({...})`


### startBrowser

`driver.startBrowser(options)`


### newPage

Opens a new tab in the browser

`driver.newPage({url, width, height})`

* `url` = `http://localhost:8080`
* `width` = `1550`
* `height` = `850`


### stopBrowser

`driver.stopBrowser()`


### setShellStatus

`driver.setShellStatus(success)`

Set the return value that will be visible to the shell, truthy values will generate 0 which represents success.


### startServer

Runs a server in a new child process, that the browser can connect to.

`driver.startServer(config = {})`

* `process` './node_modules/.bin/webpack-dev-server',
* `parameters` ['--config', 'test/render/webpack.config.js', '--progress'],
* `options` {maxBuffer: 5000 * 1024}


### stopServer

* Stops the server (child process)


### exit

* Stops the browser via `this.stopBrowser()`.
* Stops the server (child process), via `this.stopServer()`.
* Exits the current script with a status code.

This generates a return value that is visible to the shell, 0 is success.
