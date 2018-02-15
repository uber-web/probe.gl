import './init';

export {VERSION} from './utils/globals';

export {default as Log} from './log/log';

export {
  default as Bench,
  logResultsAsMarkdownTable,
  logResultsAsTree,
  logResultsAsTreeWithElapsed
} from './bench/bench';

// // Make Probe available as global variable for debugging purposes
// // TODO - convenient but can be a concern for "purists"
// export {default as Probe} from './probe';
// import Probe from './probe';
// import {global} from './utils/globals';
// global.Probe = Probe;

export {default as NodeTestDriver} from './test/node-test-driver';

// Experimental exports
import {enableDOMLogging} from './utils/log-to-dom';
export const experimental = {
  enableDOMLogging
};
