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
import {getTimestamp} from './env';
import {formatTime, formatImage, leftPad} from './utils/formatters';
import {autobind} from './utils/autobind';
import assert from 'assert';
const logger = console;

function noop() {}

/* eslint-disable no-console */
/* global console, window, Image */

const cache = {};

function formatArgs(id, firstArg, ...args) {
  if (typeof firstArg === 'string') {
    args.unshift(`${id} ${firstArg}`);
  } else {
    args.unshift(firstArg);
    args.unshift(`${id}`);
  }
  return args;
}

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
// * Supports logging with priority levels
// * Caches warnings to ensure only one of each warning is emitted
// * Reformats assert messages to show actual error string
// * Console shows actual log function call site, not wrapper call site
// * Can log images under Chrome

export default class Log {

  constructor(probe, name) {
    this.priority = null;
    this._probe = probe;
    this.name = name;
    this._logStore = [];
    this._startTs = getTimestamp();
    this._deltaTs = getTimestamp();
    this.userData = {};
    logger.timeStamp(`${name} started`);

    autobind(this);

    Object.seal(this);
  }

  getPriority() {
    return this.priority;
  }

  /*
   * Log to a group
   */
  probe(level, message, meta = {}) {
    const {delta, total} = this._getElapsedTime();
    if (this._probe._shouldLog(level)) {
      const logRow = this._probe._createLogRow({level, name: message, delta, total}, meta);
      this._logStore.push(logRow);
    }
    return this;
  }

  externalProbe(level, message, timeStart, timeSpent, meta = {}) {
    if (this._probe._shouldLog(level)) {
      // External probes are expected to provide epoch getTimestamps
      const total = timeStart - this._probe._startEpochTs;
      const delta = timeSpent;
      const logRow = this._probe._createLogRow({
        level, name: message, total, delta, indent: '  '
      }, meta);
      this._logStore.push(logRow);
    }
    return this;
  }

  log(priority, arg, ...args) {
    if (priority <= this.priority) {
      const method = console.debug || console.info;
      return this._log(priority, method, ...formatArgs(this.id, arg, ...args));
    }
    return noop;
  }

  // Log a normal message
  info(priority, arg, ...args) {
    if (priority <= this.priority) {
      return this._log(priority, console.info, ...formatArgs(this.id, arg, ...args));
    }
    return noop;
  }

  // Log a normal message, but only once, no console flooding
  once(priority, arg, ...args) {
    if (!cache[arg] && priority <= this.priority) {
      cache[arg] = getTimestamp();
      args = checkForAssertionErrors(args);
      return this._log(priority, console.error, ...formatArgs(this.id, arg, ...args));
    }
    return noop;
  }

  // Warn, but only once, no console flooding
  warn(arg, ...args) {
    if (!cache[arg]) {
      cache[arg] = getTimestamp();
      return this._log(0, console.warn, `${this.is}: ${arg}`, ...args);
    }
    return noop;
  }

  // Print an error
  error(arg, ...args) {
    return this._log(0, console.error, `${this.id}: ${arg}`, ...args);
  }

  deprecated(oldUsage, newUsage) {
    return this.warn(0, `deck.gl: \`${oldUsage}\` is deprecated and will be removed \
in a later version. Use \`${newUsage}\` instead`);
  }

  // Logs an object as a table
  table(priority, table) {
    return table ? this._log(priority, console.table, table) : noop;
  }

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

  // Logs a message with a time
  time(priority, label) {
    assert(Number.isFinite(priority), 'log priority must be a number');
    // In case the platform doesn't have console.time
    return this._log(priority, console.time ? console.time : console.info, label);
  }

  timeEnd(priority, label) {
    assert(Number.isFinite(priority), 'log priority must be a number');
    // In case the platform doesn't have console.timeEnd
    return this._log(priority, console.timeEnd ? console.timeEnd : console.info, label);
  }

  group(priority, arg, {collapsed = false} = {}) {
    const message = `${this.id}: ${arg}`;
    const method = (collapsed ? console.groupCollapsed : console.group) || console.info;
    return this._log(priority, method, message);
  }

  groupEnd(priority, arg) {
    const message = `${this.id}: ${arg}`;
    return console.groupEnd ?
      this._log(priority, console.groupEnd, message) :
      noop;
  }

  // Private Methods

  _log(priority, method, ...args) {
    assert(Number.isFinite(priority), 'log priority must be a number');

    // Verify that last log function was actually called
    this._checkLastLogFunction();

    if (priority >= this.getPriority()) {
      this._lastLogFunction = console[method].bind(console, ...args);
    }

    return this._lastLogFunction || noop;
  }

  // Verify that last log function was actually called
  _checkLastLogFunction() {
    if (this._lastLogFunction) {
      console.warn('last log function not called, calling now');
      this._lastLogFunction();
      this._lastLogFunction = null;
    }
  }

 /**
   * @return {Number} milliseconds, with fractions
   */
  getTotal() {
    return Number((getTimestamp() - this._startTs).toPrecision(10));
  }

  /**
   * @return {Number} milliseconds, with fractions
   */
  getDelta() {
    return Number((getTimestamp() - this._deltaTs).toPrecision(10));
  }

  _getElapsedTime() {
    const total = this.getTotal();
    const delta = this.getDelta();
    // reset delta timer
    this._deltaTs = getTimestamp();
    return {total, delta};
  }

  _print({collapsed}) {
    if (this._probe._shouldLog(0)) {
      const groupTotal = formatTime(this.getTotal());
      const probeTotal = formatTime(this._probe.getTotal());
      const header =
        `${leftPad(probeTotal)} ${leftPad(groupTotal)} ${this.name}`;

      if (collapsed) {
        logger.groupCollapsed(header);
      } else {
        logger.group(header);
      }

      for (const logRow of this._logStore) {
        const line = this._probe._formatLogRowForConsole(logRow);
        logger.debug(line);
      }

      logger.groupEnd();
    }
    return this;
  }
}
