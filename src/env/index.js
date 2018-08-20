// ENVIRONMENT
export {self, window, global, document, process, console} from './globals';
export {default as isBrowser, isBrowserMainThread} from './is-browser';
export {default as getBrowser, isMobile} from './get-browser';
export {default as isElectron} from './is-electron';

// ENVIRONMENT'S ASSERT IS 5K PROVIDE OUR OWN
export {assert} from './assert';
