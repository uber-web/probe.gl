/* eslint-disable no-console */
/* global console */
import {rightPad} from 'probe.gl';

// TODO - this is duplicated from bench.js to avoid circular imports
const LOG_ENTRY = {
  GROUP: 'group',
  TEST: 'test',
  COMPLETE: 'complete'
};

export function logResultsAsMarkdownTable({entry, id, itersPerSecond, error, time}) {
  const COL1 = 50;
  const COL2 = 12;
  switch (entry) {
    case LOG_ENTRY.GROUP:
      console.log('');
      console.log(`| ${rightPad(id, COL1)} | iterations/s | error |`);
      console.log(`| ${rightPad('---', COL1)} | ---          | --- |`);
      break;
    case LOG_ENTRY.TEST:
      console.log(
        `| ${rightPad(id, COL1)} | ${rightPad(itersPerSecond, COL2)} | ±${(error * 100).toFixed(
          2
        )}% |`
      );
      break;
    case LOG_ENTRY.COMPLETE:
      console.log('');
      console.log(`Completed benchmark in ${time}s`);
      break;
    default:
  }
}

export function logResultsAsTree({entry, id, itersPerSecond, error, time}) {
  switch (entry) {
    case LOG_ENTRY.GROUP:
      console.log('');
      console.log(`${id}`);
      break;
    case LOG_ENTRY.TEST:
      console.log(`├─ ${id}: ${itersPerSecond} iterations/s ±${(error * 100).toFixed(2)}%`);
      break;
    case LOG_ENTRY.COMPLETE:
      console.log('');
      console.log(`Completed benchmark in ${time}s`);
      break;
    default:
  }
}

export function logResultsAsTreeWithElapsed({entry, id, itersPerSecond, error, time}) {
  switch (entry) {
    case LOG_ENTRY.TEST:
      console.log(
        `├─ ${id}: ${itersPerSecond} iterations/s ±${(error * 100).toFixed(2)}% (${time.toFixed(
          2
        )}s elapsed)`
      );
      break;
    default:
      logResultsAsTree({entry, id, itersPerSecond, time});
  }
}
