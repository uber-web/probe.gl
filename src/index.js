import './init';

export {VERSION} from './lib/utils/globals';

export {default as Log} from './lib/log';
export {COLOR} from './lib/utils/color';

// export {default as Stats} from './lib/stats';

// Experimental exports
import {enableDOMLogging} from './lib/utils/log-to-dom';
export const experimental = {
  enableDOMLogging
};

// // Make Probe available as global variable for debugging purposes
// // TODO - convenient but can be a concern for "purists"
// export {default as Probe} from './probe';
// import Probe from './probe';
// import {global} from './lib/utils/globals';
// global.Probe = Probe;
