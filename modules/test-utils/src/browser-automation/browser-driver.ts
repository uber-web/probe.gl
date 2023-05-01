// probe.gl, MIT license

import puppeteer, {Browser, Page} from 'puppeteer';
import ChildProcess from 'child_process';

import {COLOR, Log} from '@probe.gl/log';
import {getAvailablePort} from '../utils/process-utils';

export type BrowserDriverProps = {
  id?: string;
};

type ServerInstance = {
  url: string;
  stop: () => void;
};

export type ServerConfiguration = {
  command?: string;
  arguments?: string[];
  port?: number | 'auto';
  wait?: number;
  options?: any;
  /** Callback to start the server */
  start?: (config: ServerConfiguration) => Promise<ServerInstance>;
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
  server: ServerInstance | null = null;
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
    const onRequestFail = evt => {
      onError(new Error(`cannot load ${evt.url()}`));
    };
    this.page.on('console', onConsole);
    // If the page crashes. consider the operation failed
    this.page.on('error', onError);
    // If any page resource fail to load, consider the operation failed
    this.page.on('requestfailed', onRequestFail);
    this.page.on('load', () => {
      // Once the page loads, ignore script-initiated http requests
      this.page?.off('requestfailed', onRequestFail);
      onLoad();
    });

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
  async startServer(serverConfig: ServerConfiguration = {}): Promise<string | null> {
    const {port, start = startServerCLI} = serverConfig;
    const config = {...serverConfig};

    if (port === 'auto') {
      config.port = await getAvailablePort(AUTO_PORT_START);
    }
    const server = await start(config);
    if (server) {
      this.server = server;
      this.port = config.port || null;

      this.logger.log({
        message: `Started server at ${this.server.url}`,
        color: COLOR.BRIGHT_GREEN
      })();

      return server.url;
    }
    return null;
  }

  async stopServer(): Promise<void> {
    if (this.server) {
      this.server.stop();
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

/** Default implementation of serverConfig.start */
async function startServerCLI(config: ServerConfiguration): Promise<ServerInstance> {
  const {arguments: args = [], command = 'webpack-dev-server', port} = config;

  if (port) {
    args.push('--port', String(port));
  }

  const server = ChildProcess.spawn(command, args);

  return await new Promise((resolve, reject) => {
    server.stderr.on('data', onError);
    server.on('error', onError);

    const successTimer = setTimeout(() => {
      const url = port ? `http://localhost:${port}` : 'http://localhost';

      resolve({
        url,
        stop: () => server.kill()
      });
    }, config.wait);

    function onError(error) {
      clearTimeout(successTimer);
      reject(error);
    }
  });
}
