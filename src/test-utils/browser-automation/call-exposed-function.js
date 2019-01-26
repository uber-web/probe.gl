/* global window */
export function callExposedFunction(exposedFunction, result, retry = 0) {
  // Node test driver (puppeteer) may not have had time to expose the function
  // if the test suite is short. If not available, wait a second and try again
  if (window[exposedFunction]) {
    window[exposedFunction](result);
  } else if (retry < 3) {
    window.setTimeout(callExposedFunction.bind(null, exposedFunction, result, retry + 1), 1000);
  }
}
