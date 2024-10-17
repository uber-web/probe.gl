// probe.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import {Logger, LogFunction} from './logger';

export type MemoryLogMessage = {
  level: number;
  type: 'warning' | 'error' | 'log' | 'info' | 'once' | 'table';
  message: string;
  args: unknown[];
};

export class MemoryLog implements Logger {
  userData: Record<string, unknown> = {};

  messages: MemoryLogMessage[] = [];

  /** Warn, but only once, no console flooding */
  warn(message: string, ...args: unknown[]): LogFunction {
    return () => this.messages.push({type: 'warning', level: 0, message, args});
  }

  /** Print an error */
  error(message: string, ...args: unknown[]): LogFunction {
    return () => this.messages.push({type: 'error', level: 0, message, args});
  }

  // Conditional logging

  /** Log a debug message */
  log(logLevel, message?, ...args: unknown[]): LogFunction {
    return () => this.messages.push({type: 'log', level: logLevel, message, args});
  }

  /** Log a normal message */
  info(logLevel, message?, ...args: unknown[]): LogFunction {
    return () => this.messages.push({type: 'info', level: logLevel, message, args});
  }

  /** Log a normal message, but only once, no console flooding */
  once(logLevel, message?, ...args: unknown[]): LogFunction {
    return () => this.messages.push({type: 'once', level: logLevel, message, args});
  }
}
