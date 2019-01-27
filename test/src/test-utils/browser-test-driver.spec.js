/* global document, window */
import test from 'tape-catch';

import {BrowserTestDriver} from 'probe.gl/test-utils';

test('BrowserTestDriver#import', t => {
  t.ok(BrowserTestDriver, 'BrowserTestDriver symbol imported');
  t.end();
});

test('BrowserTestDriver#ImageDiff', t => {
  if (typeof document === 'undefined' || !window.browserTest) {
    t.comment('ImageDiff only works in automated browser tests');
    t.end();
    return;
  }

  // Create test canvas
  const canvas = document.createElement('canvas');
  Object.assign(canvas.style, {position: 'fixed', top: 0, left: 0, zIndex: 99});
  canvas.width = 40;
  canvas.height = 40;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, 80, 20);
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
  document.body.append(canvas);

  const diffSettings = {
    threshold: 0.99,
    goldenImage: 'test/golden-images/test.png',
    region: {x: 0, y: 0, width: 40, height: 40}
  };

  window.browserTest('image-diff', diffSettings)
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
      ctx.fillStyle = '#ff0';
      ctx.fillRect(10, 10, 12, 12);
      return window.browserTest('image-diff', diffSettings);
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
      document.body.remove(canvas);
      t.end();
    });
});
