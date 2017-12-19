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

/* eslint-disable no-console, no-try-catch */
/* global console */
import {VERSION} from './utils/globals';
import {getTimestamp} from './utils/time-stamp';
import {formatImage} from './utils/formatters';
// import {formatTime, leftPad} from './utils/formatters';
import {autobind} from './utils/autobind';
import assert from 'assert';

// Some instrumentation may override console methods, so preserve them here
const originalConsole = {
  debug: console.debug,
  log: console.log,
  info: console.info,
  warn: console.warn,
  error: console.error
};

function noop() {}

/* eslint-disable no-console */
/* global console, window, Image */

const cache = {};

// function formatArgs(id, firstArg, ...args) {
//   if (typeof firstArg === 'string') {
//     args.unshift(`${id} ${firstArg}`);
//   } else {
//     args.unshift(firstArg);
//     args.unshift(`${id}`);
//   }
//   return args;
// }

// Assertions don't generate standard exceptions and don't print nicely
function checkForAssertionErrors(args) {
  const isAssertion =
    args && args.length > 0 &&
    typeof args[0] === 'object' && args[0] !== null &&
    args[0].name === 'AssertionError';

  if (isAssertion) {
    args = Array.prototype.slice.call(args);
    args.unshift(`assert(${args[0].message})`);
  }
  return args;
}

// A simple console wrapper
// * Papers over missing methods
// * Supports logging with priorities
// * Caches warnings to ensure only one of each warning is emitted
// * Reformats assert messages to show actual error string
// * Console shows actual log function call site, not wrapper call site
// * Can log images under Chrome

export default class Log {

  constructor({id, probe}) {
    this.enabled = false;
    this.priority = 0;
    this._probe = probe;
    this.id = id;
    this._getLogFuncStore = [];
    this._startTs = getTimestamp();
    this._deltaTs = getTimestamp();
    this._lastLogFunction = null;

    this.userData = {};
    this.timeStamp(`${this.id} started`);

    autobind(this);

    Object.seal(this);
  }

  enable(enabled = true) {
    this.enabled = enabled;
    return this;
  }

  setLevel(level) {
    this.priority = level;
    return this;
  }

  getPriority() {
    return this.priority;
  }

  // @return {Number} milliseconds, with fractions
  getTotal() {
    return Number((getTimestamp() - this._startTs).toPrecision(10));
  }

  // @return {Number} milliseconds, with fractions
  getDelta() {
    return Number((getTimestamp() - this._deltaTs).toPrecision(10));
  }

  // Unconditional logging

  // Warn, but only once, no console flooding
  warn(message, ...args) {
    if (!cache[message]) {
      const opts = this._getOpts({message, args});
      cache[message] = getTimestamp();
      return this._getLogFunc(opts, originalConsole.warn);
    }
    return noop;
  }

  // Print an error
  error(message, ...args) {
    const opts = this._getOpts({message, args});
    return this._getLogFunc(opts, originalConsole.error);
  }

  deprecated(oldUsage, newUsage) {
    return this.warn(`\`${oldUsage}\` is deprecated and will be removed \
in a later version. Use \`${newUsage}\` instead`);
  }

  removed(oldUsage, newUsage) {
    return this.error(`\`${oldUsage}\` has been removed. Use \`${newUsage}\` instead`);
  }

  // Conditional logging

  // Log to a group
  probe(priority, message, opts = {}) {
    opts = this._getOpts({priority, message, opts});
    return this._getLogFunc(opts, originalConsole.log);
  }

  // externalProbe(priority, message, timeStart, timeSpent, meta = {}) {
  //   if (this._probe._shouldLog(priority)) {
  //     // External probes are expected to provide epoch getTimestamps
  //     const total = timeStart - this._probe._startEpochTs;
  //     const delta = timeSpent;
  //     const logRow = this._probe._createLogRow({
  //       priority, name: message, total, delta, indent: '  '
  //     }, meta);
  //     this._getLogFuncStore.push(logRow);
  //   }
  //   return this;
  // }
  // Log a normal message
  // info(priority, message, ...args) {
  //   return this._getLogFuncFromOpts({
  //     priority, message, args,
  //     method: console.info
  //   });

  log(priority, message, ...args) {
    return this._getLogFuncFromOpts({
      priority,
      message,
      args,
      method: originalConsole.debug || originalConsole.info
    });
  }

  // Log a normal message, but only once, no console flooding
  once(priority, message, ...args) {
    if (!cache[message] && priority <= this.priority) {
      cache[message] = getTimestamp();
      args = checkForAssertionErrors(args);
      return this._getLogFunc(priority, originalConsole.log);
    }
    return noop;
  }

  // Logs an object as a table
  // table(priority, table) {
  //   const opts = this._getOpts({priority});
  //   return table ? this._getLogFuncFromOpts({
  //     priority,
  //     method: console.table
  //   }) : noop;
  // }

  // logs an image under Chrome
  image({priority, image, message = '', scale = 1}) {
    if (priority > this.priority) {
      return noop;
    }
    if (typeof window === 'undefined') { // Let's not try this under node
      return noop;
    }
    if (typeof image === 'string') {
      const img = new Image();
      img.onload = () => console.log(formatImage.bind(null, img, message, scale));
      img.src = image;
    }
    const element = image.nodeName || '';
    if (element.toLowerCase() === 'img') {
      console.log(formatImage(image, message, scale));
    }
    if (element.toLowerCase() === 'canvas') {
      const img = new Image();
      img.onload = () => console.log(formatImage.bind(null, img, message, scale));
      img.src = image.toDataURL();
    }
    return noop;
  }

  time(priority, message) {
    return this._getLogFuncFromOpts({
      priority,
      message,
      method: console.time ? console.time : console.info
    });
  }

  timeEnd(priority, message) {
    return this._getLogFuncFromOpts({
      priority,
      message,
      method: console.timeEnd ? console.timeEnd : console.info
    });
  }

  timeStamp() {}

  // timeStamp(priority, message) {
  //   return this._getLogFuncFromOpts({
  //     priority,
  //     message,
  //     method: console.timeStamp
  //   });
  // }

  group(priority, message, opts = {}) {
    opts = this._getOpts({priority, message, opts});
    const {collapsed = false} = opts;
    const method = (collapsed ? console.groupCollapsed : console.group) || console.info;
    return this._getLogFunc(opts, method);
  }

  groupEnd(priority, message) {
    return this._getLogFuncFromOpts({
      priority,
      message,
      method: console.groupEnd
    });
  }

  trace() {
    if (console.trace) {
      console.trace();
    }
  }

  // Private Methods

  _getOpts({priority, message, args = [], opts}) {
    // log(message, args)
    if (typeof priority === 'string') {
      if (message) {
        args.unshift(message);
      }
      message = priority;
      priority = 0;
    }

    assert(Number.isFinite(priority), 'log priority must be a number');

    const {delta, total} = this._getElapsedTime();

    const newOptions = {
      priority,
      message: `${this.id}: ${message}`,
      args,
      delta,
      total
    };
    return Object.assign(newOptions, opts);
  }

  _getLogFunc(opts, method) {
    // Verify that last log function was actually called
    this._checkLastLogFunction();

    assert(method);

    if (this._shouldLog(opts.priority)) {
      // Bind to ensure
      this._lastLogFunction =
        method.bind(console, opts.message, ...opts.args);
    }

    return this._lastLogFunction || noop;
  }

  _getLogFuncFromOpts(opts) {
    const {method} = opts;
    opts = this._getOpts(opts);
    return this._getLogFunc(opts, method);
  }

  _shouldLog(priority) {
    assert(Number.isFinite(priority), 'log priority must be a number');
    return this.priority >= priority;
  }

  // Verify that last log function was actually called
  _checkLastLogFunction() {
    if (this._lastLogFunction) {
      // console.warn('last log function not called, calling now');
      // this._lastLogFunction();
      // this._lastLogFunction = null;
    }
  }

  _getElapsedTime() {
    const total = this.getTotal();
    const delta = this.getDelta();
    // reset delta timer
    this._deltaTs = getTimestamp();
    return {total, delta};
  }

  // _print({collapsed}) {
  //   if (this._probe._shouldLog(0)) {
  //     const groupTotal = formatTime(this.getTotal());
  //     const probeTotal = formatTime(this._probe.getTotal());
  //     const header =
  //       `${leftPad(probeTotal)} ${leftPad(groupTotal)} ${this.id}`;

  //     if (collapsed) {
  //       logger.groupCollapsed(header);
  //     } else {
  //       logger.group(header);
  //     }

  //     for (const logRow of this._getLogFuncStore) {
  //       const line = this._probe._formatLogRowForConsole(logRow);
  //       logger.debug(line);
  //     }

  //     logger.groupEnd();
  //   }
  //   return this;
  // }
}

Log.VERSION = VERSION;
