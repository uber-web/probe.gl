// Extract injected version from package.json (injected by babel plugin)
// @ts-expect-error
export const VERSION = typeof __VERSION__ !== 'undefined' ? __VERSION__ : 'untranspiled source';

// ENVIRONMENT
export {self, window, global, document, process, console} from './lib/globals';
export {isBrowser} from './lib/is-browser';
export {getBrowser, isMobile} from './lib/get-browser';
export {isElectron} from './lib/is-electron';

// ENVIRONMENT'S ASSERT IS 5-15KB, SO WE PROVIDE OUR OWN
export {assert} from './utils/assert';

// TODO - wish we could just export a constant
// export const isBrowser = checkIfBrowser();
