// probe.gl, MIT license

import puppeteer, {Browser} from 'puppeteer';
import ChildProcess from 'child_process';

import {COLOR, Log} from 'probe.gl';
import {getAvailablePort} from '../utils/process-utils';

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

export default class BrowserDriver {
  readonly id: string;
  logger: Log;
  browser: Browser;
  page: any;
  server;
  port;

  constructor(options?: {id?: string}) {
    const {id = 'browser-driver'} = options || {};
    this.id = id;
    this.logger = new Log({id});

    this.server = null;
    this.browser = null;
    this.page = null;
    this.port = null;
  }

  startBrowser(options?: {
    headless?: boolean;
    defaultViewport?: {width: number; height: number};
  }): Promise<void> {
    options = Object.assign({}, DEFAULT_PUPPETEER_OPTIONS, options);

    if (this.browser) {
      return Promise.resolve(this.browser);
    }
    return puppeteer.launch(options).then(browser => {
      this.browser = browser;
      browser.version().then(console.log); // eslint-disable-line
    });
  }

  openPage(options?: {
    url?: string;
    exposeFunctions?: object;
    onLoad?: (...args: any) => any;
    onConsole?: (...args: any) => any;
    onError?: (...args: any) => any;
  }): Promise<void> {
    const {
      url = 'http://localhost',
      exposeFunctions = {},
      onLoad = noop,
      onConsole = noop,
      onError = noop
    } = options || {};

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

  stopBrowser(): Promise<void> {
    if (this.browser) {
      return this.browser.close().then(() => {
        this.browser = null;
      });
    }
    return Promise.resolve();
  }

  /** Starts a web server with the provided configs.
   * Resolves to the bound url if successful
   */
  startServer(config?: {port?: number; command?: string; options?: object}): Promise<string> {
    // @ts-expect-error
    config = normalizeServerConfig(config, this.logger);

    const getPort =
      // @ts-expect-error
      config.port === 'auto' ? getAvailablePort(AUTO_PORT_START) : Promise.resolve(config.port);

    return getPort.then(
      port =>
        new Promise((resolve, reject) => {
          // @ts-expect-error
          const args = [...config.arguments];
          if (port) {
            args.push('--port', port);
          }

          const server = ChildProcess.spawn(config.command, args, config.options);

          server.stderr.on('data', onError);
          server.on('error', onError);
          server.on('close', () => () => {
            this.server = null;
          });
          this.server = server;
          this.port = port;

          const successTimer = setTimeout(() => {
            const url = `http://localhost:${this.port}`;

            this.logger.log({
              message: `Started ${config.command} at ${url}`,
              color: COLOR.BRIGHT_GREEN
            })();

            resolve(url);
            // @ts-expect-error
          }, config.wait);

          function onError(error) {
            clearTimeout(successTimer);
            reject(error);
          }
        })
    );
  }

  stopServer(): Promise<void> {
    if (this.server) {
      this.server.kill();
      this.server = null;
    }
    return Promise.resolve();
  }

  /* eslint-disable no-process-exit */
  exit(statusCode = 0): Promise<void> {
    return this.stopBrowser()
      .then(() => this.stopServer())
      .then(() => process.exit(statusCode))
      .catch(error => {
        this.logger.error(error.message || error);
        process.exit(1);
      });
  }
}

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
