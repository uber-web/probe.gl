// probe.gl, MIT license

import BrowserDriver from './browser-driver';
import {COLOR, addColor} from 'probe.gl';
import diffImages from '../utils/diff-images';
import * as eventDispatchers from '../utils/puppeteer-events';
import fs from 'fs';

const MAX_CONSOLE_MESSAGE_LENGTH = 500;

export default class BrowserTestDriver extends BrowserDriver {
  title;
  headless;
  maxConsoleMessageLength;
  time = Date.now();
  failures = 0;

  run(config: Record<string, any> = {}): Promise<void> {
    const {
      title = 'Browser Test',
      headless = false,
      maxConsoleMessageLength = MAX_CONSOLE_MESSAGE_LENGTH
    } = config;
    this.title = title;
    this.headless = headless;
    this.maxConsoleMessageLength = maxConsoleMessageLength;
    this.time = Date.now();
    this.failures = 0;

    this.logger.log({
      message: `${title}`,
      color: COLOR.BRIGHT_YELLOW
    })();

    // Backward compatibility: if `server` is not defined, fallback to config object
    return this._startServer(config.server || config)
      .then(url => {
        return this._openPage(url, config);
      })
      .then(result => {
        return this._onFinish(result);
      })
      .catch(error => {
        this._fail(error.message || error);
      });
  }

  _openPage(url, config: Record<string, any> = {}) {
    const browserConfig = Object.assign({}, config.browser, {headless: this.headless});

    return this.startBrowser(browserConfig).then(
      _ =>
        new Promise((resolve, reject) => {
          const exposeFunctions = Object.assign({}, config.exposeFunctions, {
            browserTestDriver_fail: () => this.failures++,
            browserTestDriver_finish: message => resolve(message),
            browserTestDriver_emulateInput: event => this._emulateInput(event),
            browserTestDriver_captureAndDiffScreen: opts => this._captureAndDiff(opts)
          });

          // Puppeteer can only inject functions, not values, into the global scope
          // In headless mode, we inject the function so it's truthy
          // In non-headless mode, we don't inject the function so it's undefined
          if (this.headless) {
            exposeFunctions.browserTestDriver_isHeadless = () => true;
          }

          // Legacy config
          if (config.exposeFunction) {
            this.logger.removed('exposeFunction', 'browserTestDriver_sendMessage');
          }

          this.logger.log({
            message: 'Loading page in browser...',
            color: COLOR.BRIGHT_YELLOW
          })();

          this.openPage({
            url: config.url || url,
            exposeFunctions,
            onConsole: event => this._onConsole(event),
            onError: reject
          });
        })
    );
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

  /* eslint-disable no-console */
  _onConsole(event) {
    if (!this.headless) {
      // Do not mirror console messages if the browser is open
      return;
    }

    // Terminal console does not collapse big messages like Chrome does
    // Crop very long text messages to avoid flooding
    let text = event.text();
    if (!text.startsWith('data:')) {
      // Leave data URL intact so that we have a channel to get data out via console
      text = text.slice(0, this.maxConsoleMessageLength);
    }
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

    if (this.headless) {
      this.exit(0);
    }
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

  _emulateInput(event) {
    // eslint-disable-next-line import/namespace
    if (eventDispatchers[event.type]) {
      // eslint-disable-next-line import/namespace
      return eventDispatchers[event.type](this.page, event);
    }
    throw new Error(`Unknown event: ${event.type}`);
  }

  _captureAndDiff(opts) {
    if (!opts.goldenImage) {
      return Promise.reject(new Error('Must supply golden image for image diff'));
    }

    const screenshotOptions = {
      type: 'png',
      omitBackground: true,
      encoding: 'binary'
    };
    if (opts.region) {
      // @ts-expect-error
      screenshotOptions.clip = opts.region;
    } else {
      // @ts-expect-error
      screenshotOptions.fullPage = true;
    }
    return this.page
      .screenshot(screenshotOptions)
      .then(image => diffImages(image, opts.goldenImage, opts))
      .then(result => {
        if (!result.success && opts.saveOnFail && result.source1) {
          let filename = opts.saveAs || '[name]-failed.png';
          filename = filename.replace('[name]', opts.goldenImage.replace(/\.\w+$/, ''));
          this._saveScreenshot(filename, result.source1);
        }
        return {
          headless: this.headless,
          match: result.match || 0,
          matchPercentage: result.matchPercentage || 'N/A',
          success: result.success,
          diffImage: result.diffImage || null,
          error: result.error || null
        };
      })
      .catch(error => {
        return {
          headless: this.headless,
          match: 0,
          matchPercentage: 'N/A',
          success: false,
          error: error.message
        };
      });
  }

  _saveScreenshot(filename, data) {
    this.logger.log({
      message: `Writing screenshot to ${filename}`,
      color: COLOR.BRIGHT_YELLOW
    })();
    fs.writeFile(filename, data, error => {
      if (error) {
        this.logger.log({
          message: `Save screenshot failed: ${error.message}`,
          color: COLOR.BRIGHT_RED
        })();
      }
    });
  }
}
