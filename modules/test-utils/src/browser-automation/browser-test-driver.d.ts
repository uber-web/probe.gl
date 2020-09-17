import BrowserDriver from './browser-driver';

export default class BrowserTestDriver extends BrowserDriver {
  run(config?: object): Promise<void>;
}
