# Browser Test Example

This is a minimal example of using `@probe.gl/test-utils` for browser-based tests.

The example consists of two parts:

* `index.js` - test script executed under Node
* `test/index.js` - test script executed under Browser

See [BrowserTestDriver API](/docs/api-reference/test-utils/browser-test-driver.md) for documentation.

## Run example

```bash
yarn
# run headless test (result logged to terminal)
yarn test
# run test in browser for debugging (result logged to Chrome console)
yarn test-browser
```

