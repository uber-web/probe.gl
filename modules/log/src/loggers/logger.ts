// probe.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

/* eslint-disable no-console,prefer-rest-params */
export type LogFunction = () => void;

/** A common interface for loggers */

export interface Logger {
  // Unconditional logging

  /** Warn, but only once, no console flooding */
  warn(message: string, ...args: unknown[]): LogFunction;

  /** Print an error */
  error(message: string, ...args: unknown[]): LogFunction;

  // Conditional logging

  /** Log a debug message */
  log(logLevel, message?, ...args: unknown[]): LogFunction;

  /** Log a normal message */
  info(logLevel, message?, ...args: unknown[]): LogFunction;

  /** Log a normal message, but only once, no console flooding */
  once(logLevel, message?, ...args: unknown[]): LogFunction;
}
