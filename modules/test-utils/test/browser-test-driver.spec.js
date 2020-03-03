import test from 'tape-catch';

import {BrowserTestDriver} from '@probe.gl/test-utils';

function createTestCanvas() {
  const canvas = document.createElement('canvas');
  Object.assign(canvas.style, {position: 'fixed', top: 0, left: 0, zIndex: 99});
  canvas.width = 40;
  canvas.height = 40;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, 40, 40);
  ctx.strokeStyle = '#000';
  ctx.fillStyle = '#f00';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(8, 8);
  ctx.lineTo(32, 8);
  ctx.lineTo(20, 32);
  ctx.closePath();
  ctx.stroke();
  ctx.fill();

  return canvas;
}

test('BrowserTestDriver#import', t => {
  t.ok(BrowserTestDriver, 'BrowserTestDriver symbol imported');
  t.end();
});

test('BrowserTestDriver#ImageDiff', t => {
  // @ts-ignore
  if (typeof document === 'undefined' || !window.browserTestDriver_captureAndDiffScreen) {
    t.comment('ImageDiff only works in automated browser tests');
    t.end();
    return;
  }

  const canvas = createTestCanvas();
  document.body.append(canvas);

  const diffSettings = {
    threshold: 0.99,
    goldenImage: 'test/golden-images/test.png',
    region: {x: 0, y: 0, width: 40, height: 40}
  };

  window
    // @ts-ignore
    .browserTestDriver_captureAndDiffScreen(diffSettings)
    .then(result => {
      if (result.success) {
        t.pass(`Screenshot matches golden image: ${result.matchPercentage}`);
      } else if (result.error) {
        t.fail(`Image diff throws error: ${result.error}`);
      } else {
        t.fail(`Screenshot should match golden image: ${result.matchPercentage}`);
      }
    })
    .then(() => {
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ff0';
      ctx.fillRect(10, 10, 12, 12);
      // @ts-ignore
      return window.browserTestDriver_captureAndDiffScreen(diffSettings);
    })
    .then(result => {
      if (result.success) {
        t.fail(`Screenshot should not match golden image: ${result.matchPercentage}`);
      } else if (result.error) {
        t.fail(`Image diff throws error: ${result.error}`);
      } else {
        t.pass(`Screenshot does not match golden image: ${result.matchPercentage}`);
      }
    })
    .finally(() => {
      document.body.removeChild(canvas);
      t.end();
    });
});
