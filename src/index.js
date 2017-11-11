export {VERSION} from './utils/globals';

export {default as Log} from './logger';

export {default as Bench} from './bench';

// // Make Probe available as global variable for debugging purposes
// // TODO - convenient but can be a concern for "purists"
// export {default as Probe} from './probe';
// import Probe from './probe';
// import {global} from './utils/globals';
// global.Probe = Probe;

// Experimental exports
import {enableDOMLogging} from './utils/log-to-dom';
export const experimental = {
  enableDOMLogging
};
