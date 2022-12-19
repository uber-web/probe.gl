/* eslint-disable no-console */
import type {LogEntry} from './bench';
import {rightPad} from '@probe.gl/log';

export function logResultsAsMarkdownTable(logEntry: LogEntry): void {
  const {entry, id, itersPerSecond, error, time} = logEntry;

  const COL1 = 50;
  const COL2 = 12;
  switch (entry) {
    case 'group':
      console.log('');
      console.log(`| ${rightPad(id, COL1)} | iterations/s | error |`);
      console.log(`| ${rightPad('---', COL1)} | ---          | --- |`);
      break;
    case 'test':
      console.log(
        `| ${rightPad(id, COL1)} | ${rightPad(itersPerSecond, COL2)} | ±${(error * 100).toFixed(
          2
        )}% |`
      );
      break;
    case 'complete':
      console.log('');
      console.log(`Completed benchmark in ${time}s`);
      break;
    default:
  }
}

export function logResultsAsTree(logEntry: LogEntry): void {
  const {entry, id, itersPerSecond, error, time, unit} = logEntry;

  switch (entry) {
    case 'group':
      console.log('');
      console.log(`${id}`);
      break;
    case 'test':
      console.log(`├─ ${id}: ${itersPerSecond} ${unit}/s ±${(error * 100).toFixed(2)}%`);
      break;
    case 'complete':
      console.log('');
      console.log(`Completed benchmark in ${time}s`);
      break;
    default:
  }
}

export function logResultsAsTreeWithElapsed(logEntry: LogEntry): void {
  const {entry, id, itersPerSecond, error, time, unit} = logEntry;

  switch (entry) {
    case 'test':
      console.log(
        `├─ ${id}: ${itersPerSecond} ${unit}/s ±${(error * 100).toFixed(2)}% (${time.toFixed(
          2
        )}s elapsed)`
      );
      break;
    default:
      logResultsAsTree(logEntry);
  }
}
