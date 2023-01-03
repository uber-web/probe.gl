// Polyfill for non-puppeteer environments
// so that test bundle can run in other browsers
// A puppeteer injected method returns a promise

// @ts-nocheck

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

if (!window.browserTestDriver_finish) {
  window.browserTestDriver_fail = noOp;
  window.browserTestDriver_finish = noOp;
  window.browserTestDriver_emulateInput = emulateInput;
  window.browserTestDriver_captureAndDiffScreen = captureAndDiffScreen;
}
