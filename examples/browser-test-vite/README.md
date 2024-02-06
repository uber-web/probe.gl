# Browser Test Example

This is a minimal example of using `@probe.gl/test-utils` for browser-based tests.

The example consists of two parts:

* `start.js` - launcher of the browser test, executed under Node
* `index.js` - entry point of the tests executed in Browser

See [BrowserTestDriver API](/docs/api-reference/test-utils/browser-test-driver.md) for documentation.

## Run example

```bash
yarn
# run headless test (result logged to terminal)
yarn test
# run test in browser for debugging (result logged to Chrome console)
yarn test-browser
```

