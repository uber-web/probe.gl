# About Testing

probe.gl provides a set of test utilities intended to facilitate typical testing tasks.


## Browser Test Automation

A key part of the test utilities is a framework for automating browser tests using puppeteer. The intention is to make browser tests invokable from the terminal by e.g. `package.json` scripts, by spawning a browser and waiting until the test results are available, then closing the browser and reporting back the results to the shell script.

* `BrowserDriver` is a relatively low-level class that provides a `Promise` based interface to `puppeteer` as well as facilities for spawning a "dev server" and communicating status via exit codes back to the invoking shell. This class is intended as a building block for custom automation tasks.
* `BrowserTestDriver` is a subclass of `BrowserDriver` that is intended to be a "turn-key" solution for typical browser set.


## Function Spys

probe.gl provides a `makeSpy` function that enable you to check if your functions were called during exection of test code.


## Visual Regression Testing

probe.gl provides a set of experimental image loading and diffing tools. Together with the Automation facilities it is possible to create sophisticated visual regression tests. More to come...