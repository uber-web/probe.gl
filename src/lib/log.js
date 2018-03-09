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
import LocalStorage from './utils/local-storage';
import {getTimestamp} from './utils/timestamp';
import {formatImage} from './utils/formatters';
import {addColor} from './utils/color';
import {autobind} from './utils/autobind';
import {isBrowser} from './utils/globals';
import assert from 'assert';

/* eslint-disable no-console */
/* global console, window, Image */

// Instrumentation in other packages may override console methods, so preserve them here
const originalConsole = {
  debug: isBrowser ? console.debug || console.log : console.log,
  log: console.log,
  info: console.info,
  warn: console.warn,
  error: console.error,
  groupEnd: console.groupEnd.bind(console)
};

const DEFAULT_SETTINGS = {
  enabled: false,
  priority: 0
};

function noop() {}

const cache = {};

function throttle(tag, timeout) {
  const prevTime = cache[tag];
  const time = Date.now();
  if (!prevTime || (time - prevTime > timeout)) {
    cache[tag] = time;
    return true;
  }
  return false;
}

function getTableHeader(table) {
  for (const key in table) {
    for (const title in table[key]) {
      return title || 'untitled';
    }
  }
  return 'empty';
}

/* CODE from deck.gl logger, delete when replicated
function formatArgs(firstArg, ...args) {
  if (typeof firstArg === 'function') {
    firstArg = firstArg();
  }
  if (typeof firstArg === 'string') {
    args.unshift(`deck.gl ${firstArg}`);
  } else {
    args.unshift(firstArg);
    args.unshift('deck.gl');
  }
  return args;
}

// Assertions don't generate standard exceptions and don't print nicely
function checkForAssertionErrors(args) {
  const isAssertion =
    args &&
    args.length > 0 &&
    typeof args[0] === 'object' &&
    args[0] !== null &&
    args[0].name === 'AssertionError';

  if (isAssertion) {
    args = Array.prototype.slice.call(args);
    args.unshift(`assert(${args[0].message})`);
  }
  return args;
}
*/

// A simple console wrapper

export default class Log {

  constructor({id, probe} = {}) {
    this.id = id;
    this._probe = probe;
    this._getLogFuncStore = [];
    this._startTs = getTimestamp();
    this._deltaTs = getTimestamp();
    this._lastLogFunction = null;

    // TODO - fix support from throttling groups
    this.LOG_THROTTLE_TIMEOUT = 0; // Time before throttled messages are logged again

    this.userData = {};
    this.timeStamp(`${this.id} started`);

    this._storage = new LocalStorage(`probe-${this.id}`, DEFAULT_SETTINGS);

    autobind(this);
    Object.seal(this);
  }

  enable(enabled = true) {
    this._storage.updateConfiguration({enabled});
    return this;
  }

  setLevel(level) {
    this._storage.updateConfiguration({priority: level});
    return this;
  }

  set priority(newPriority) {
    this._storage.updateConfiguration({priority: newPriority});
    return this;
  }

  get enabled() {
    return this._storage.config.enabled;
  }

  get priority() {
    return this._storage.config.priority;
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
    return this._getLogFunction({
      message,
      args,
      method: originalConsole.warn,
      once: true
    });
  }

  // Print an error
  error(message, ...args) {
    return this._getLogFunction({message, args, method: originalConsole.error});
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
  probe(priority, message, ...args) {
    return this._getLogFunction({
      priority,
      message,
      args,
      method: originalConsole.log
    });
  }

  // Log a debug message
  log(priority, message, ...args) {
    return this._getLogFunction({
      priority,
      message,
      args,
      method: originalConsole.debug
    });
  }

  // Log a normal message
  info(priority, message, ...args) {
    return this._getLogFunction({
      priority, message, args,
      method: console.info
    });
  }

  // Log a normal message, but only once, no console flooding
  once(priority, message, ...args) {
    return this._getLogFunction({
      priority,
      message,
      args,
      method: originalConsole.debug || originalConsole.info,
      once: true
    });
  }

  table(priority, table, columns) {
    if (table) {
      const tag = getTableHeader(table);
      return this._getLogFunction({
        priority,
        message: table,
        args: columns && [columns],
        tag,
        method: console.table
      });
    }
    return noop;
  }

  // Logs an object as a table
  // table(priority, table) {
  //   const opts = this._parseArguments({priority});
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
    return this._getLogFunction({
      priority,
      message,
      method: console.time ? console.time : console.info
    });
  }

  timeEnd(priority, message) {
    return this._getLogFunction({
      priority,
      message,
      method: console.timeEnd ? console.timeEnd : console.info
    });
  }

  timeStamp() {}

  // timeStamp(priority, message) {
  //   return this._getLogFunction({
  //     priority,
  //     message,
  //     method: console.timeStamp
  //   });
  // }

  group(priority, message, opts = {collapsed: false}) {
    opts = this._parseArguments({priority, message, opts});
    const {collapsed} = opts;
    return this._getLogFunction({
      priority,
      message,
      opts,
      method: (collapsed ? console.groupCollapsed : console.group) || console.info
    });
  }

  groupCollapsed(priority, message, opts = {}) {
    return this.group(priority, message, Object.assign({}, opts, {collapsed: true}));
  }

  groupEnd(priority) {
    return this._getLogFunction({
      priority,
      message: '',
      method: console.groupEnd || noop
    });
  }

  // EXPERIMENTAL

  withGroup(priority, message, func) {
    const opts = this._parseArguments({
      priority,
      message
    });

    this.group(opts);

    try {
      func();
    } finally {
      this.groupEnd(opts.message);
    }
  }

  trace() {
    if (console.trace) {
      console.trace();
    }
  }

  // PRIVATE METHODS

  _getLogFunction(opts) {
    const {method} = opts;

    opts = this._parseArguments(opts);

    // Verify that last log function was actually called
    this._checkLastLogFunction();

    assert(method);

    if (this._shouldLog(opts.priority)) {
      let {message} = opts;
      const tag = opts.tag || opts.message;

      if (opts.once) {
        if (!cache[tag]) {
          cache[tag] = getTimestamp();
        } else {
          return noop;
        }
      }

      // if (opts.nothrottle || !throttle(tag, this.LOG_THROTTLE_TIMEOUT)) {
      //   return noop;
      // }

      message = addColor(message, opts.color, opts.background);

      // Bind console function so that it can be called after being returned
      this._lastLogFunction = method.bind(console, message, ...opts.args);
    }

    // Catch missing `()()`
    const logFunction = this._lastLogFunction || noop;
    this._lastLogFunction = null;
    return logFunction;
  }

  // "Normalizes" the various argument patterns into an object with known types
  // - log(priority, message, args) => {priority, message, args}
  // - log(message, args) => {priority: 0, message, args}
  // - log({priority, ...}, message, args) => {priority, message, args}
  // - log({priority, message, args}) => {priority, message, args}
  _parseArguments({priority, message, args = [], opts = {}}) {
    const newOpts = this._normalizeArguments({priority, message, args});

    const {delta, total} = this._getElapsedTime();

    return Object.assign(newOpts, opts, {
      message: typeof newOpts === 'string' ? `${this.id}: ${newOpts.message}` : newOpts.message,
      delta,
      total
    });
  }

  // helper for _parseArguments
  _normalizeArguments({priority, message, args = []}) {
    let newOpts = null;

    switch (typeof priority) {
    case 'number':
      assert(priority >= 0);
      newOpts = {priority, message, args};
      break;

    case 'string':
    case 'function':
      if (message !== undefined) {
        args.unshift(message);
      }
      newOpts = {priority: 0, message: priority, args};
      break;

    case 'object':
      const opts = priority;
      newOpts = Object.assign({priority: 0, message, args}, opts);
      break;

    default:
      newOpts = {priority: 0, message, args};
      break;
    }

    assert(Number.isFinite(newOpts.priority)); // 'log priority must be a number'

    // Resolve functions into strings by calling them
    if (typeof newOpts.message === 'function') {
      newOpts.message = this._shouldLog(newOpts.priority) ? newOpts.message() : '';
    }

    // 'log message must be a string' or object
    assert(typeof newOpts.message === 'string' || typeof newOpts.message === 'object');

    return newOpts;
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
