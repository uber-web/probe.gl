const test = require('tape');

if (window.browserTestDriver_finish) {
  // Is automated test, add BrowserTestDriver hooks
  test.onFailure(window.browserTestDriver_fail);
  test.onFinish(window.browserTestDriver_finish);
}

test('A test', t => {
  t.pass('ok');

  t.end();
});
