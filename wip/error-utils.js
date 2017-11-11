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

/**
 * Utilities for dev-mode error handling
 */
/* eslint-disable no-console, no-debugger */
/* global window, console */
function noop() {}

// Polyfill console

// Console.debug is useful in chrome as it enables filtering and
// (depending on Chrome version) distinctive styling, but is not available in node
console.debug = console.debug || console.log;

// Groups, timeStamps, table are not available in node
console.group = console.group || console.log;
console.groupCollapsed = console.groupCollapsed || console.log;
console.groupEnd = console.groupEnd || noop;

console.timeStamp = console.timeStamp || noop;
console.table = console.table || noop;

/**
 * Ensure that your debugger stops when code issues warnings so that
 * you can see what is going on in othercomponents when they decide
 * to issue warnings.
 *
 * @param {Array} consoleBlacklist - array of strings to match against
 */
export function breakOnConsoleWarnings(consoleBlacklist = [/.*/]) {
  function breakOnConsole(log, msg, param1, ...params) {
    if (typeof msg === 'string' &&
      msg.indexOf('Unhandled promise rejection') === 0) {
      log(msg, param1, ...params);
      throw new Error(param1);
    } else if (consoleBlacklist.some(pattern => pattern.test(msg))) {
      log(msg, param1, ...params);
    } else {
      log(msg, param1, ...params);
    }
  }
  console.warn = breakOnConsole.bind(null, console.native.warn);
  console.error = breakOnConsole.bind(null, console.native.error);

  window.onerror = (message, url, line, column, error) => {
    if (error) {
      console.native.error(`${error} ${url}:${line}:${column || 0}`);
    } else {
      console.native.error(`${message} ${url}:${line}:${column || 0}`);
    }
    debugger;
  };
}

/**
 * Throw exceptions when code issues warnings so that
 * you can access them in your normal exception handling setup, perhaps
 * displaying them in the UI or logging them in a different way.
 *
 * @param {Array} consoleBlacklist - array of strings to match against
 */
export function throwOnConsoleWarnings(consoleBlacklist = [/.*/]) {
  console.warn = function throwOnWarning(msg) {
    if (consoleBlacklist.some(patt => patt.test(msg))) {
      throw new Error(`Unacceptable warning: ${msg}`);
    }
    console.native.warn(...arguments);
  };
}

// Chrome has yet to implement onRejectedPromise, so trigger onerror instead
export function interceptRejectedPromises() {
  console.error = (msg, error, ...params) => {
    if (typeof msg === 'string' &&
      msg.indexOf('Unhandled promise rejection') === 0) {
      error.unhandledPromise = true;
      // Use different message to avoid triggering again
      console.native.error('Rejected promise', error, ...params);
      throw error;
    }
    console.native.error(...arguments);
  };
}
