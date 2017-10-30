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
import {logger, getTimestamp} from './env';
import {formatTime, leftPad} from './utils/formatters';

export default class Group {

  constructor(probe, name) {
    this._probe = probe;
    this.name = name;
    this._logStore = [];
    this._startTs = getTimestamp();
    this._deltaTs = getTimestamp();
    this.userData = {};
    logger.timeStamp(`${name} started`);
    Object.seal(this);
  }

  /*
   * Log to a group
   */
  probe(level, message, meta = {}) {
    const {delta, total} = this._getElapsedTime();
    if (this._probe._shouldLog(level)) {
      const logRow = this._probe._createLogRow({
        level, name: message, delta, total
      }, meta);
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

  /*
   * End a group, which finally prints a group
   */
  end({collapsed = true} = {}) {
    this._probe._logStore = this._probe._logStore.concat(this._logStore);
    this._print({collapsed});
    logger.timeStamp(`${this.name} ended`);
    return this;
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
