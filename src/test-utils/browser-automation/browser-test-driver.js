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
/* global console */
import BrowserDriver from './browser-driver';
import {COLOR, addColor} from '../../lib/utils/color';

export default class BrowserTestDriver extends BrowserDriver {
  run(config = {}) {
    const {title = 'Browser Test', headless = false} = config;
    this.title = title;
    this.headless = headless;
    this.time = Date.now();
    this.failures = 0;

    this.logger.log({
      message: `${title}`,
      color: COLOR.BRIGHT_YELLOW
    })();

    return this._startServer(config.server)
      .then(url => {
        this.logger.log({
          message: `Started service at ${url}`,
          color: COLOR.BRIGHT_GREEN
        })();
        return this._openPage(url, config);
      })
      .then(result => {
        return this._onFinish(result);
      })
      .catch(error => {
        this._fail(error.message || error)
      });
  }

  _openPage(url, config = {}) {
    const browserConfig = Object.assign({}, config.browser, {headless: this.headless});

    return this.startBrowser(browserConfig)
      .then(_ => new Promise((resolve, reject) => {
        const exposeFunctions = Object.assign({}, config.exposeFunctions, {
          browserTest: this._onMessage.bind(this, resolve, reject),
          // Capture any uncaught errors
          onerror: reject
        });

        this.logger.log({
          message: 'Loading page in browser...',
          color: COLOR.BRIGHT_YELLOW
        })()

        this.openPage({
          url: config.url || url,
          exposeFunctions,
          onConsole: event => this._onConsole(event),
          onError: reject
        });
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

  _onMessage(resolve, reject, event, args) {
    switch (event) {
    case 'fail':
      this.failures++;
      break;

    case 'done':
      resolve(args);
      break;

    default:
    }
  }

  /* eslint-disable no-console */
  _onConsole(event) {
    if (!this.headless) {
      // Do not mirror console messages if the browser is open
      return;
    }

    // Crop very long text messages
    const text = event.text().slice(0, 500);
    switch (event.type()) {
    case 'log':
      console.log(text);
      break;

    case 'warning':
      console.log(addColor(text, COLOR.YELLOW));
      break;

    case 'error':
      console.log(addColor(text, COLOR.RED));
      break;

    default:
      // ignore
    }
  }
  /* eslint-enable no-console */

  _onFinish(message) {
    const elapsed = ((Date.now() - this.time) / 1000).toFixed(1);
    this.logger.log({
      message: `${this.title} completed in ${elapsed}s.`,
      color: COLOR.BRIGHT_YELLOW
    })();

    if (this.failures) {
      this._fail(message || `${this.failures} test${this.failures > 1 ? 's' : ''} failed`);
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

    if (this.headless) {
      this.exit(1);
    }
  }
}
