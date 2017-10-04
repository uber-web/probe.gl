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
 * Common environment setup
 */
/* eslint-disable no-console */
/* global process */
import console from 'global/console';
import window from 'global/window';

// Duck-type Node context
export const IS_NODE = typeof process !== undefined &&
  process.toString() === '[object process]';

// Configure console

// Console.debug is useful in chrome as it gives blue styling, but is not
// available in node
console.debug = console.debug || console.log;

// Some instrumentation may override console methods, so preserve them here
console.native = {
  debug: console.debug.bind(console),
  log: console.log.bind(console),
  warn: console.warn.bind(console),
  error: console.error.bind(console)
};

export {console as logger};

// Set up high resolution timer
let timestamp;
if (IS_NODE) {
  timestamp = () => {
    const [seconds, nanoseconds] = process.hrtime();
    return seconds + nanoseconds / 1e6;
  };
} else if (window.performance) {
  timestamp = () => window.performance.now();
} else {
  timestamp = () => Date.now();
}

export {timestamp as timestamp};
