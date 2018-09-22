import './init';

export {VERSION} from './lib/utils/globals';

// ENVIRONMENT
export {self, window, global, document, process, console} from './env/globals';
export {default as isBrowser, isBrowserMainThread} from './env/is-browser';
export {default as getBrowser, isMobile} from './env/get-browser';
export {default as isElectron} from './env/is-electron';

// ENVIRONMENT'S ASSERT IS 5-15KB, SO WE PROVIDE OUR OWN
export {default as assert} from './env/assert';

// STATS (PERFORMANCE PROFILING)
export {default as Stats} from './lib/stats';

// LOGGING
export {default as Log} from './lib/log';
export {COLOR} from './lib/utils/color';

// DEFAULT EXPORT IS A LOG INSTANCE
import {default as Log} from './lib/log';
export default new Log({id: 'probe.gl'});

// EXPERIMENTAL EXPORTS
// DOM LOGGING
export {enableDOMLogging as _enableDOMLogging} from './lib/utils/log-to-dom';
