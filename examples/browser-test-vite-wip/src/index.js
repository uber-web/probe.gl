// probe.gl logging example
import test from 'tape';

// Add BrowserTestDriver hooks
// @ts-expect-error
test.onFailure(window.browserTestDriver_fail);
// @ts-expect-error
test.onFinish(window.browserTestDriver_finish);

test('A test', t => {
  // Default tape test timeout is 500ms - allow enough time for render and screenshot
  t.timeoutAfter(2000);

  const app = document.getElementById('app');

  window
    // @ts-expect-error
    .browserTestDriver_captureAndDiffScreen({
      threshold: 0.99,
      goldenImage: 'test/golden-image-error.png',
      region: app.getBoundingClientRect(),
      saveOnFail: true
    })
    .then(result => {
      if (result.error) {
        t.fail(result.error);
      } else {
        t.ok(result.success, `Render test matched ${result.matchPercentage}`);
      }
      t.end();
    });
});
