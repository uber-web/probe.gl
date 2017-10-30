export {default as Logger} from './logger';
export {default as Probe} from './probe';

// Make Probe available as global variable for debugging purposes
import Probe from './probe';
import {global} from './utils/global';
global.Probe = Probe;
