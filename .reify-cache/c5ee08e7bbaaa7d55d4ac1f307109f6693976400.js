"use strict";module.export({default:()=>BrowserDriver});var puppeteer;module.link('puppeteer',{default(v){puppeteer=v}},0);var ChildProcess;module.link('child_process',{default(v){ChildProcess=v}},1);var COLOR,Log;module.link('probe.gl',{COLOR(v){COLOR=v},Log(v){Log=v}},2);var getAvailablePort;module.link('./process-utils',{getAvailablePort(v){getAvailablePort=v}},3);// Copyright (c) 2015 - 2017 Uber Technologies, Inc.
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

function noop() {}

function normalizeServerConfig(config, logger) {
  const result = Object.assign({}, DEFAULT_SERVER_CONFIG);

  // Handle legacy configs
  if (config.process) {
    result.command = config.process;
    logger.deprecated('process', 'command');
  }
  if (config.parameters) {
    result.arguments = config.parameters;
    logger.deprecated('parameters', 'arguments');
  }

  Object.assign(result, config, {
    options: Object.assign({}, result.options, config.options)
  });

  return result;
}

class BrowserDriver {
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
    return puppeteer.launch(options).then(browser => {
      this.browser = browser;
    });
  }

  openPage({
    url = 'http://localhost',
    exposeFunctions = {},
    onLoad = noop,
    onConsole = noop,
    onError = noop
  } = {}) {
    if (!this.browser) {
      return Promise.reject(
        new Error('No browser instance is found. Forgot to call startBrowser()?')
      );
    }

    return this.browser
      .newPage()
      .then(page => {
        this.page = page;

        // attach events
        page.on('load', onLoad);
        page.on('console', onConsole);
        page.on('error', onError);

        const promises = [];
        for (const name in exposeFunctions) {
          promises.push(page.exposeFunction(name, exposeFunctions[name]));
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
    config = normalizeServerConfig(config, this.logger);

    const getPort =
      config.port === 'auto' ? getAvailablePort(AUTO_PORT_START) : Promise.resolve(config.port);

    return getPort.then(
      port =>
        new Promise((resolve, reject) => {
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

          setTimeout(() => {
            const url = `http://localhost:${this.port}`;

            this.logger.log({
              message: `Started ${config.command} at ${url}`,
              color: COLOR.BRIGHT_GREEN
            })();

            resolve(url);
          }, config.wait);
        })
    );
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
        this.logger.error(error.message || error);
        process.exit(1);
      });
  }
}
