import {ConsoleLog} from './loggers/console-log';

// DEFAULT EXPORT IS A LOG INSTANCE
export default new ConsoleLog({id: '@probe.gl/log'});

// LOGGING
export type {Logger} from './loggers/logger';
export {ConsoleLog, ConsoleLog as Log} from './loggers/console-log';
export type {MemoryLogMessage} from './loggers/memory-log';
export {MemoryLog} from './loggers/memory-log';

// UTILITIES
export {COLOR} from './utils/color';
export {addColor} from './utils/color';
export {leftPad, rightPad} from './utils/formatters';
export {autobind} from './utils/autobind';
export {LocalStorage} from './utils/local-storage';
export {getHiResTimestamp} from './utils/hi-res-timestamp';

import './init';
