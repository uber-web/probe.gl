// probe.gl, MIT license

import puppeteer, {Browser, Page, PuppeteerLaunchOptions, ConsoleMessage} from 'puppeteer';
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

const AUTO_PORT_START = 5000;

function noop() {} // eslint-disable-line @typescript-eslint/no-empty-function

export default class BrowserDriver {
  readonly id: string;
  logger: Log;
  server: ServerInstance | null = null;
  browser: Browser | null = null;
  page: Page | null = null;

  constructor(options?: BrowserDriverProps) {
    const {id = 'browser-driver'} = options || {};
    this.id = id;
    this.logger = new Log({id});
  }

  async startBrowser(puppeteerOptions?: PuppeteerLaunchOptions): Promise<void> {
    if (this.browser) {
      return;
    }
    this.browser = await puppeteer.launch(puppeteerOptions);
    const browserVersion = await this.browser.version();
    this.logger.log(`Launched browser version ${browserVersion}`)();
  }

  async openPage(options?: {
    url?: string;
    exposeFunctions?: Record<string, Function>;
    onLoad?: () => void;
    onConsole?: (e: ConsoleMessage) => void;
    onError?: (e: Error) => void;
  }): Promise<Page> {
    const {
      url,
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

    if (url) {
      await this.page.goto(url);
    }

    return this.page;
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
  async startServer(serverConfig: ServerConfiguration): Promise<string | null> {
    const {port, start = startServerCLI} = serverConfig;
    const config = {...serverConfig};

    if (port === 'auto') {
      config.port = await getAvailablePort(AUTO_PORT_START);
    }
    const server = await start(config);
    if (server) {
      this.server = server;

      this.logger.log({
        message: `Started server at ${server.url}`,
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
      this.logger.error(error instanceof Error ? error.message : String(error))();
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
    server.stdout.on('data', data => {
      console.log(data.toString());
    });
    server.stderr.on('data', data => {
      console.error(data.toString());
    });
    server.on('close', onClose);

    const successTimer = setTimeout(() => {
      const url = port ? `http://localhost:${port}` : 'http://localhost';

      resolve({
        url,
        stop: () => server.kill()
      });
    }, config.wait);

    function onClose(code) {
      if (!code) {
        clearTimeout(successTimer);
        reject();
      }
    }
  });
}
