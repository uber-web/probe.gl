// @ts-nocheck

async function functionKeysDown(page, {shiftKey, ctrlKey, metaKey}) {
  if (shiftKey) {
    await page.keyboard.down('Shift');
  }
  if (ctrlKey) {
    await page.keyboard.down('Control');
  }
  if (metaKey) {
    await page.keyboard.down('Meta');
  }
}

async function functionKeysUp(page, {shiftKey, ctrlKey, metaKey}) {
  if (shiftKey) {
    await page.keyboard.up('Shift');
  }
  if (ctrlKey) {
    await page.keyboard.up('Control');
  }
  if (metaKey) {
    await page.keyboard.up('Meta');
  }
}

/*
 * {
     type: 'keypress',
     key: <string>,
     shiftKey: false,
     ctrlKey: false,
     metaKey: false,
     delay: 0
   }
 * keys:
 * https://github.com/GoogleChrome/puppeteer/blob/master/lib/USKeyboardLayout.js
 */
export async function keypress(page, event) {
  await functionKeysDown(page, event);
  await page.keyboard.press(event.key, {delay: event.delay || 0});
  await functionKeysUp(page, event);
}

/*
 * {
     type: 'click',
     x: <number>,
     y: <number>,
     button: 'left',
     delay: 0,
     shiftKey: false,
     ctrlKey: false,
     metaKey: false
   }
 */
export async function click(page, event) {
  await functionKeysDown(page, event);
  await page.mouse.click(event.x, event.y, {
    button: event.button || 'left',
    delay: event.delay || 0
  });
  await functionKeysUp(page, event);
}

/*
 * {
     type: 'mousemove',
     x: <number>,
     y: <number>,
     steps: 1
   }
 */
export async function mousemove(page, event) {
  await page.mouse.move(event.x, event.y, {
    steps: event.steps || 1
  });
}

/*
 * {
     type: 'drag',
     startX: <number>,
     startY: <number>,
     endX: <number>,
     endY: <number>,
     button: 'left',
     steps: 1,
     shiftKey: false,
     ctrlKey: false,
     metaKey: false
   }
 */
export async function drag(page, event) {
  await functionKeysDown(page, event);
  await page.mouse.move(event.startX, event.startY);
  await page.mouse.down(event.button || 'left');
  await page.mouse.move(event.endX, event.endY, {steps: event.steps || 1});
  await page.mouse.up(event.button || 'left');
  await functionKeysUp(page, event);
}
