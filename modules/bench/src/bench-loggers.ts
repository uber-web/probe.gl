/* eslint-disable no-console */
import type {LogEntry} from './bench';
import {rightPad} from '@probe.gl/log';

export function logResultsAsMarkdownTable(logEntry: LogEntry): void {
  const COL1 = 50;
  const COL2 = 12;
  switch (logEntry.type) {
    case 'group':
      console.log('');
      console.log(`| ${rightPad(logEntry.id, COL1)} | iterations/s | error |`);
      console.log(`| ${rightPad('---', COL1)} | ---          | --- |`);
      break;
    case 'test':
      console.log(
        `| ${rightPad(logEntry.id, COL1)} | ${rightPad(logEntry.itersPerSecond, COL2)} | ±${(
          logEntry.error * 100
        ).toFixed(2)}% |`
      );
      break;
    case 'complete':
      console.log('');
      console.log(`Completed benchmark in ${logEntry.time}s`);
      break;
    default:
  }
}

export function logResultsAsTree(logEntry: LogEntry): void {
  switch (logEntry.type) {
    case 'group':
      console.log('');
      console.log(`${logEntry.id}`);
      break;
    case 'test':
      console.log(
        `├─ ${logEntry.id}: ${logEntry.itersPerSecond} ${logEntry.unit}/s ±${(
          logEntry.error * 100
        ).toFixed(2)}%`
      );
      break;
    case 'complete':
      console.log('');
      console.log(`Completed benchmark in ${logEntry.time}s`);
      break;
    default:
  }
}

export function logResultsAsTreeWithElapsed(logEntry: LogEntry): void {
  switch (logEntry.type) {
    case 'test':
      console.log(
        `├─ ${logEntry.id}: ${logEntry.itersPerSecond} ${logEntry.unit}/s ±${(
          logEntry.error * 100
        ).toFixed(2)}% (${logEntry.time.toFixed(2)}s elapsed)`
      );
      break;
    default:
      logResultsAsTree(logEntry);
  }
}
