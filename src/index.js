export {
  BROWSER,
  isBrowser,
  isMobile
} from './browser';

export {
  breakOnConsoleWarnings,
  throwOnConsoleWarnings,
  interceptRejectedPromises
} from './error-utils';

import Probe from './probe';
export {Probe};
export default new Probe();
