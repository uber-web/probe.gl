// Copyright (c) 2015 - 2017 Uber Technologies, Inc.
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

/* global process */
import BrowserDriver from './browser-driver';
import {COLOR} from '../../lib/utils/color';

export default class BrowserTestDriver extends BrowserDriver {
  run(config = {}) {
    const {title = 'Browser Test'} = config;
    this.title = title;
    this.time = Date.now();
    this.failures = 0;

    this.logger.log({
      message: `${title}`,
      color: COLOR.YELLOW
    })();

    return Promise.resolve()
      .then(_ => this._startServer(config.server))
      .then(url => this._openPage(url, config))
      .then(result => this._onFinish(result))
      .catch(error => {
        this._fail(error.message);
      });
  }

  _openPage(url, config = {}) {
    return this.startBrowser(config.browser)
      .then(_ => new Promise(resolve => {
        const exposeFunctions = Object.assign({
          browserTestLog: console.log, // eslint-disable-line
          browserTestFail: () => this.failures++,
          browserTestComplete: resolve,

          // This overwrites window.onerror and captures any unhandled error on the page
          // Otherwise if page crashes this process will hang forever
          onerror: error => {
            throw error;
          }
        }, config.exposeFunctions);

        this.openPage({url: config.url || url, exposeFunctions});
      }));
  }

  _startServer(config = {}) {
    if (!config) {
      return null;
    }
    if (typeof config === 'function') {
      return config();
    }
    return this.startServer(config);
  }

  _onFinish(message) {
    const elapsed = ((Date.now() - this.time) / 1000).toFixed(1);
    this.logger.log({
      message: `${this.title} completed in ${elapsed}s.`,
      color: COLOR.YELLOW
    })();

    if (this.failures) {
      this._fail(message || `${this.failures} test${this.failures > 1 ? 's' : ''} failed`)
    } else {
      this._pass(message || 'All tests passed');
    }
  }

  _pass(message) {
    this.logger.log({
      message: `${this.title} successful: ${message}`,
      color: COLOR.BRIGHT_GREEN
    })();
    this.exit(0);
  }

  _fail(message) {
    this.logger.log({
      message: `${this.title} failed: ${message}`,
      color: COLOR.BRIGHT_RED
    })();
    this.exit(1);
  }
}
