export {default as Log} from './log';
export {default as Probe} from './probe';
export {default as Bench} from './bench';

// Make Probe available as global variable for debugging purposes
import Probe from './probe';
import {global} from './utils/globals';
global.Probe = Probe;

// experimental exports
import {logToDOM} from './utils/log-to-dom';
export const experimental = {
  logToDOM
};
