// probe.gl, MIT license

export type {LogEntry, LogEntryType, Logger, BenchProps} from './bench';

export {default as Bench, LOG_ENTRY} from './bench';
export {
  logResultsAsMarkdownTable,
  logResultsAsTree,
  logResultsAsTreeWithElapsed
} from './bench-loggers';
