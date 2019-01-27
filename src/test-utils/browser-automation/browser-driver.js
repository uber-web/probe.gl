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

/* global process, setTimeout */
import {COLOR} from '../../lib/utils/color';
import Log from '../../lib/log';
import puppeteer from 'puppeteer';
import ChildProcess from 'child_process';

const DEFAULT_SERVER_CONFIG = {
  command: 'webpack-dev-server',
  arguments: [],
  port: 'auto',
  wait: 2000,
  options: {maxBuffer: 5000 * 1024}
};

// https://github.com/GoogleChrome/puppeteer/blob/v1.11.0/docs/api.md#puppeteerlaunchoptions
const DEFAULT_PUPPETEER_OPTIONS = {
  headless: false,
  defaultViewport: {width: 800, height: 600}
};

const AUTO_PORT_START = 5000;

function mergeServerConfigs(...configs) {
  const result = Object.assign({}, DEFAULT_SERVER_CONFIG);

  for (const config of configs) {
    Object.assign(result, config, {
      arguments: result.arguments.concat(config.arguments),
      options: Object.assign({}, result.options, result.options)
    });
  }

  return result;
}

export default class BrowserDriver {
  constructor({id = 'browser-driver'} = {}) {
    this.id = id;
    this.logger = new Log({id});

    this.server = null;
    this.browser = null;
    this.page = null;
    this.port = null;
  }

  startBrowser(options = {}) {
    options = Object.assign({}, DEFAULT_PUPPETEER_OPTIONS, options);

    if (this.browser) {
      return Promise.resolve(this.browser);
    }
    return puppeteer
      .launch(options)
      .then(browser => {
        this.browser = browser;
      });
  }

  openPage({url = 'http://localhost', exposeFunctions = {}} = {}) {
    this.logger.log({
      message: `Opening page at ${url}`,
      color: COLOR.YELLOW
    })();

    if (!this.browser) {
      return Promise.reject(
        new Error('No browser instance is found. Forgot to call startBrowser()?')
      );
    }

    return this.browser.newPage()
      .then(page => {
        this.page = page;

        const promises = [];
        for (const name in exposeFunctions) {
          promises.push(
            page.exposeFunction(name, exposeFunctions[name])
          );
        }
        return Promise.all(promises);
      })
      .then(_ => this.page.goto(url));
  }

  stopBrowser() {
    if (this.browser) {
      return this.browser.close().then(() => {
        this.browser = null;
      });
    }
    return Promise.resolve();
  }

  // Starts a web server with the provided configs
  // Resolves to the bound url if successful
  startServer(config = {}) {
    config = mergeServerConfigs(config);

    const getPort = config.port === 'auto' ?
      this._getAvailablePort() : Promise.resolve(config.port);

    return getPort.then(port => new Promise((resolve, reject) => {
      const args = [...config.arguments];
      if (port) {
        args.push('--port', port);
      }

      const server = ChildProcess.spawn(config.command, args, config.options);
      server.on('error', error => {
        reject(error);
      });
      server.on('close', () => () => {
        this.server = null;
      });
      this.server = server;
      this.port = port;

      this.logger.log({
        message: `Started service on port ${port}`,
        color: COLOR.BRIGHT_GREEN
      })();

      setTimeout(() => resolve(`http://localhost:${this.port}`), config.wait);
    }));
  }

  stopServer() {
    if (this.server) {
      this.server.kill();
      this.server = null;
    }
    return Promise.resolve();
  }

  /* eslint-disable no-process-exit */
  exit(statusCode = 0) {
    this.stopBrowser()
      .then(() => this.stopServer())
      .then(() => process.exit(statusCode))
      .catch(error => {
        this.logger.error(error.message);
        process.exit(1);
      });
  }

  _getAvailablePort() {
    return new Promise((resolve, reject) => {
      // Get a list of all ports in use
      ChildProcess.exec('lsof -i -P -n | grep LISTEN', (error, stdout, stderr) => {
        if (error) {
          // likely no permission, e.g. CI
          resolve(AUTO_PORT_START);
          return;
        }

        const portsInUse = [];
        const regex = /:(\d+) \(LISTEN\)/;
        stdout.split('\n').forEach(line => {
          const match = line.match(regex);
          if (match) {
            portsInUse.push(Number(match[1]));
          }
        });
        let port = AUTO_PORT_START;
        while (portsInUse.includes(port)) {
          port++;
        }
        resolve(port);
      });
    });
  }
}
