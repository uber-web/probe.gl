// probe.gl, MIT license

import puppeteer, {Browser, Page} from 'puppeteer';
import ChildProcess from 'child_process';

import {COLOR, Log} from '@probe.gl/log';
import {getAvailablePort} from '../utils/process-utils';

type BrowserDriverProps = {
  id?: string;
};

type ServerConfig = {
  command?: string;
  arguments?: string[];
  port?: number | 'auto';
  wait?: number;
  options?: {
    maxBuffer?: number; // TODO - not a recognized spawn option
  };
};

const DEFAULT_SERVER_CONFIG: Required<ServerConfig> = {
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
  server: ChildProcess.ChildProcessWithoutNullStreams | null = null;
  port: number | 'auto' | null = null;
  browser: Browser | null = null;
  page: Page | null = null;

  constructor(options?: BrowserDriverProps) {
    const {id = 'browser-driver'} = options || {};
    this.id = id;
    this.logger = new Log({id});
  }

  async startBrowser(puppeteerOptions?: {
    headless?: boolean;
    defaultViewport?: {width: number; height: number};
  }): Promise<void> {
    if (this.browser) {
      return;
    }
    const options = {...DEFAULT_PUPPETEER_OPTIONS, ...puppeteerOptions};
    this.browser = await puppeteer.launch(options);
    const browserVersion = await this.browser.version();
    this.logger.log(`Launched browser version ${browserVersion}`);
  }

  async openPage(options?: {
    url?: string;
    exposeFunctions?: Record<string, Function>;
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

    // https://ourcodeworld.com/articles/read/1106/how-to-solve-puppeteer-timeouterror-navigation-timeout-of-30000-ms-exceeded
    this.page.setDefaultNavigationTimeout(0);

    // attach events
    this.page.on('load', onLoad);
    this.page.on('console', onConsole);
    this.page.on('error', onError);

    const promises: Promise<void>[] = [];
    for (const [name, functionToExpose] of Object.entries(exposeFunctions)) {
      promises.push(this.page.exposeFunction(name, functionToExpose));
    }
    await Promise.all(promises);

    await this.page.goto(url);
  }

  async stopBrowser(): Promise<void> {
    if (!this.browser) {
      return;
    }
    await this.browser.close();
    this.browser = null;
  }

  /** Starts a web server with the provided configs.
   * Resolves to the bound url if successful
   */
  async startServer(
    serverConfig: {
      port?: number | 'auto';
      command?: string;
      options?: object;
    } = {}
  ): Promise<string> {
    const config = normalizeServerConfig(serverConfig, this.logger);

    const port = config.port === 'auto' ? await getAvailablePort(AUTO_PORT_START) : config?.port;

    const args = [...config.arguments];
    if (port) {
      args.push('--port', String(port));
    }

    const server = ChildProcess.spawn(config.command, args, config.options as any); // TODO invalid spawn options
    this.server = server;
    this.port = port || null;

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
      this.logger.error(error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  }
}

function normalizeServerConfig(config: ServerConfig, logger: Log): Required<ServerConfig> {
  const result: Required<ServerConfig> = {...DEFAULT_SERVER_CONFIG, ...config};

  Object.assign(result, {
    options: {...result.options, ...config.options}
  });

  return result;
}
