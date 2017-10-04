// Copyright (c) 2017 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

// This function is needed in initialization stages,
// make sure it can be imported in isolation

/* global navigator, window, process */

// Simple browser detection
function detectBrowser() {
  /* global process */
  const isNode =
    typeof process === 'object' &&
    String(process) === '[object process]' &&
    !process.browser;
  if (isNode) {
    return 'Node';
  }

  /* global navigator */
  const {userAgent} = navigator;
  if (userAgent.indexOf('Chrome') > -1) {
    return 'Chrome';
  }
  if (userAgent.indexOf('Firefox') > -1) {
    return 'Firefox';
  }
  if (userAgent.indexOf('Safari') > -1) {
    return 'Safari';
  }
  if (userAgent.indexOf('MSIE') > -1) {
    return navigator.appVersion.indexOf('Trident') > -1 ? 'IE11' : 'Edge';
  }
  return 'Unknown';
}

export const BROWSER = detectBrowser();

export const isBrowser = BROWSER !== 'Node';

export const isMobile =
  typeof window.orientation !== 'undefined' ||
  navigator.userAgent.indexOf('IEMobile') > -1;

export default isBrowser;
