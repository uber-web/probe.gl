// probe.gl, MIT license

import puppeteer, {Browser, Page} from 'puppeteer';
import ChildProcess from 'child_process';

import {COLOR, Log} from '@probe.gl/log';
import {getAvailablePort} from '../utils/process-utils';

type BrowserDriverProps = {
  id?: string;
};

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

function noop() {} // eslint-disable-line @typescript-eslint/no-empty-function

export default class BrowserDriver {
  readonly id: string;
  logger: Log;
  server: ChildProcess.ChildProcessWithoutNullStreams = null;
  port: number | 'auto' = null;
  browser: Browser = null;
  page: Page = null;

  constructor(options?: BrowserDriverProps) {
    const {id = 'browser-driver'} = options || {};
    this.id = id;
    this.logger = new Log({id});
  }

  async startBrowser(options?: {
    headless?: boolean;
    defaultViewport?: {width: number; height: number};
  }): Promise<void> {
    options = Object.assign({}, DEFAULT_PUPPETEER_OPTIONS, options);
    if (this.browser) {
      return;
    }
    this.browser = await puppeteer.launch(options);
    console.log(await this.browser.version()); // eslint-disable-line
  }

  async openPage(options?: {
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
      throw new Error('No browser instance is found. Forgot to call startBrowser()?');
    }

    this.page = await this.browser.newPage();

    // attach events
    this.page.on('load', onLoad);
    this.page.on('console', onConsole);
    this.page.on('error', onError);

    const promises: Promise<any>[] = [];
    for (const name in exposeFunctions) {
      promises.push(this.page.exposeFunction(name, exposeFunctions[name]));
    }
    await Promise.all(promises);

    await this.page.goto(url);
  }

  async stopBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  /** Starts a web server with the provided configs.
   * Resolves to the bound url if successful
   */
  async startServer(config?: {
    port?: number | 'auto';
    command?: string;
    options?: object;
  }): Promise<string> {
    // @ts-expect-error
    config = normalizeServerConfig(config, this.logger);

    const port = config.port === 'auto' ? await getAvailablePort(AUTO_PORT_START) : config.port;

    // @ts-expect-error
    const args = [...config.arguments];
    if (port) {
      args.push('--port', port);
    }

    const server = ChildProcess.spawn(config.command, args, config.options);
    this.server = server;
    this.port = port;

    return await new Promise((resolve, reject) => {
      server.stderr.on('data', onError);
      server.on('error', onError);
      server.on('close', () => () => {
        this.server = null;
      });

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
    });
  }

  async stopServer(): Promise<void> {
    if (this.server) {
      this.server.kill();
      this.server = null;
    }
  }

  /* eslint-disable no-process-exit */
  async exit(statusCode: number = 0): Promise<void> {
    try {
      await this.stopBrowser();
      await this.stopServer();
      process.exit(statusCode);
    } catch (error) {
      this.logger.error(error.message || error);
      process.exit(1);
    }
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
