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

import {Log} from 'probe.gl';
import {Browser} from 'puppeteer';

// const DEFAULT_SERVER_CONFIG = {
//   command: 'webpack-dev-server',
//   arguments: [],
//   port: 'auto',
//   wait: 2000,
//   options: {maxBuffer: 5000 * 1024}
// };

export default class BrowserDriver {
  readonly id: string;
  logger: Log;
  browser: Browser;
  readonly page: any;

  constructor(options?: {id?: string});

  startBrowser(options?: {
    headless?: boolean;
    defaultViewport?: {width: number; height: number};
  }): Promise<void>;

  openPage(options?: {
    url?: string;
    exposeFunctions?: object;
    onLoad?: (...args: any) => any;
    onConsole?: (...args: any) => any;
    onError?: (...args: any) => any;
  }): Promise<void>;

  stopBrowser(): Promise<void>;

  /** Starts a web server with the provided configs.
   * Resolves to the bound url if successful
   */
  startServer(config?: {port?: number; command?: string; options?: object}): Promise<string>;

  stopServer(): Promise<void>;

  exit(statusCode?: number): Promise<void>;
}
