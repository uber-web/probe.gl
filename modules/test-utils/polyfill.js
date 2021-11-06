// Polyfill for non-puppeteer environments
// so that test bundle can run in other browsers
// A puppeteer injected method returns a promise
function noOp() {
  return Promise.resolve();
}
function emulateInput() {
  // eslint-disable-next-line
  console.error('BrowserTestDriver: emulateInput is not available');
  return Promise.resolve();
}
function captureAndDiffScreen() {
  // eslint-disable-next-line
  console.error('BrowserTestDriver: emulateInput is not available');
  return Promise.resolve({
    headless: false,
    match: 0,
    matchPercentage: 'N/A',
    success: true
  });
}
// @ts-expect-error
if (!window.browserTestDriver_finish) {
  // @ts-expect-error
  window.browserTestDriver_fail = noOp;
  // @ts-expect-error
  window.browserTestDriver_finish = noOp;
  // @ts-expect-error
  window.browserTestDriver_emulateInput = emulateInput;
  // @ts-expect-error
  window.browserTestDriver_captureAndDiffScreen = captureAndDiffScreen;
}
