// Copyright (c) 2017 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

/* eslint-disable no-console, no-try-catch */
/* global console */
import {isBrowser, VERSION} from './utils/globals';
import {formatTime, leftPad} from './utils/formatters';
import LocalStorage from './utils/local-storage';
import NodeStorage from './utils/node-storage';
import {getTimestamp, startTimestamp} from './time-stamp';
import Group from './group';
import assert from 'assert';
/* global setInterval */

const logger = console;

const DEFAULT_CONFIG = {
  isEnabled: {value: false, doc: 'Whether probe is enabled (off by default)'},
  level: {value: 1, doc: 'Controls what is logged, higher numbers = more logs'},
  isLogEnabled: {value: true, doc: 'Whether logging is turned on'},
  isPrintEnabled: {value: true, doc: 'Whether logging prints to console'},
  isRunEnabled: {value: true, doc: 'Whether Probe.run executes code'},
  useIndirectLogging: {value: false, doc: 'Whether Probe returns functions'},
  ignoreEnvironment: {value: false, doc: 'Reset to default config'}
};

// In a browser environment, probe will store its configuration in this cookie
// This allows settings to persist across browser reloads
const PROBE_STORAGE_KEY_NAME = '__probe.gl__';

function noop() {
  return noop;
}

// List of probe methods that should become noops when probe is disabled
const METHODS_TO_DISABLE = [
  'run', 'getOption',
  'getIterationsPerSecond', 'logIterationsPerSecond',
  '_probe', '_fps', '_externalProbe', '_log'
];

const INTERACTIVE_CHECK_TIMEOUT = 50;

export default class Probe {
  // @param {Object} config Optional configuration args; see #configure
  constructor(config = {}) {
    assert(typeof config.id === 'string');
    this.id = config.id;

    this.VERSION = VERSION;

    this.storage = isBrowser ? new LocalStorage() : new NodeStorage();

    this.reset();
    // Timestamps - pegged to best estimate of system/program start time
    this._startTs = startTimestamp;
    // Other systems passing in epoch info require an epoch ts to convert
    this._startEpochTs = Date.now();

    // Get initial configuration from environment
    this._initConfig({ignoreEnvironment: config.ignoreEnvironment});
    // Override with new configuration, if any
    this.configure(config);

    // Disable methods if necessary
    if (!this._getOption('isEnabled')) {
      this.disable();
    }

    // Calls a timer and counts how many times it fires.
    // This is used to calculate percentage of elapsed time that system
    // was not loaded.
    this._startInteractiveHearbeat();
  }

  // Reset all internal stores, dropping logs
  reset() {
    // Data containers
    this._logStore = [];
    this._sampleStore = {};
    this._fpsStore = {};
    this._startStore = {};
    this._groupStore = {};
    this._firstStore = {};

    // Timestamps
    this._startTs = getTimestamp();
    this._deltaTs = getTimestamp();
    this._iterationsTs = null;
  }

  toString() {
    const enabled = this.isEnabled() ? 'enabled' : 'disabled';
    return `<Probe: ${enabled} level: ${this.getLevel()}>`;
  }

  // Turn probe on
  // @param {Object} opts={} - map of options to set
  // @return {Probe} self, to support chaining
  enable(opts = {}) {
    // Swap in live methods
    for (const method of METHODS_TO_DISABLE) {
      this[method] = Probe.prototype[method];
    }
    return this.configure(Object.assign({isEnabled: true}, opts));
  }

  // Turn probe off
  // @return {Probe} self, to support chaining
  disable() {
    // Swap in noops for live methods
    for (const method of METHODS_TO_DISABLE) {
      this[method] = noop;
    }
    return this.configure({isEnabled: false});
  }

  // Whether Probe is currently enabled
  // @return {Boolean} isEnabled
  isEnabled() {
    // getOption is set to noop when Probe is disabled, check _config directly
    return Boolean(this._getOption('isEnabled'));
  }

  // Convenience function: Set probe level
  // @param {Number} level Level to set
  // @return {Probe} self, to support chaining
  setLevel(level) {
    return this.configure({level});
  }

  getLevel() {
    return this._getOption('level');
  }

  // OPTIONS INTERFACE

  // Registers an option, including description and default value.
  // Note, differs from setOption in that it does not change the value
  // of the option if the option is already set. However, the description
  // will always be updated.
  //
  // @param {String} key - The name of the option
  // @param {*} defaultValue= - Set as value if option does not already exist
  // @param {String} description= - Optional description for Probe.showOptions()
  // @return {Probe} - returns itself for chaining.
  addOption(key, defaultValue = null, description = null) {
    assert(typeof key === 'string', 'Probe.addOption needs key argument');
    // Go through some hoops so that we can call configure in the end
    let value;
    if (this._config[key]) {
      this._config[key].doc = description || this._config[key].doc || 'N/A';
      value = this._config[key].value;
    } else {
      this._config[key] = {
        value: defaultValue,
        doc: description || 'N/A'
      };
      value = defaultValue;
    }
    this.configure({[key]: value});
    return this;
  }

  // Sets an option.
  // @param {String} key - The name of the option
  // @param {*} value - Set as value if option does not already exist
  // @return {Probe} - returns itself for chaining.
  setOption(key, value) {
    assert(typeof key === 'string', 'Probe.setOption needs key argument');
    return this.configure({[key]: value});
  }

  // Get a single option from probe's persistent configuration.
  // By supplying default value and description the app can ensure the
  // option gets documented (for Probe.showOptions())
  //
  // @param  {String} key - name of the option
  // @param  {String} defaultValue - name of the option
  // @param  {String} description - name of the option
  // @return {*} - Option value, or defaultValue if no option with tha key
  getOption(key, defaultValue = null, description = null) {
    return this._getOption(key, defaultValue, description);
  }

  // 'getOption' can be disabled, but is still needed internally
  // so we also provide _getOption
  _getOption(key, defaultValue = null, description = null) {
    assert(typeof key === 'string', 'Probe.getOption needs key argument');
    if (description) {
      this.addOption({key, value: defaultValue, description});
    }
    return this._config[key] ? this._config[key].value : defaultValue;
  }

  // Lists all options, with value and descriptions in a table
  // @return {Probe} - returns itself for chaining.
  showOptions() {
    logger.table(this._config);
    return this;
  }

  help() {
    logger.table(this._config);
    return this;
  }

  // Configure probe with new values (can include custom key/value pairs).
  // Configuration will be persisted across browser sessions
  // @param {Object} config={} - Map of options to configure
  // @param {Boolean} config.isEnabled Whether probe is enabled
  // @param {Number} config.level Logging level
  // @param {Boolean} config.isLogEnabled Whether logging prints to console
  // @param {Boolean} config.isRunEnabled Whether #run executes code
  // @return {Probe} self, to support chaining
  configure(config = {}) {
    for (const key in config) {
      const value = config[key];
      this._config[key] = this._config[key] || {doc: 'N/A'};
      this._config[key].value = value;
    }
    return this._updateEnvironment();
  }

  resetConfig() {
    this._config = Object.assign({}, DEFAULT_CONFIG);
    return this._updateEnvironment();
  }

  // Get current log, as an array of log row objects
  // @return {Object[]} Log
  getLog() {
    return this._logStore.slice();
  }

  // Reset the long timer
  resetStart() {
    this._startTs = this._deltaTs = getTimestamp();
  }

  // Reset the time since last probe
  resetDelta() {
    this._deltaTs = getTimestamp();
  }

  // @return {Number} milliseconds, with fractions
  getTotal() {
    return getTimestamp() - this._startTs;
  }

  // @return {Number} milliseconds, with fractions
  getDelta() {
    return getTimestamp() - this._deltaTs;
  }

  // Displays a double timing (from "start time" and from last probe).
  // _probe(level, name, meta) {
  // @returns {Function} - log function (should be called immediately by app)
  probe(...args) {
    return this._probe(1, ...args);
  }

  probe1(...args) {
    return this._probe(1, ...args);
  }

  probe2(...args) {
    return this._probe(2, ...args);
  }

  probe3(...args) {
    return this._probe(3, ...args);
  }

  // Display an averaged value of the time since last probe.
  // Keyed on the first string argument.
  // @param {Number} level
  // @param {String} message
  // @param {Object} meta
  // @returns {Function} - log function (should be called immediately by app)
  sample(...args) {
    return this._sample(1, ...args);
  }

  sample1(...args) {
    return this._sample(1, ...args);
  }

  sample2(...args) {
    return this._sample(2, ...args);
  }

  sample3(...args) {
    return this._sample(3, ...args);
  }

  // These functions will average the time between calls and log that value
  // every couple of calls, in effect showing a times per second this
  // function is called - sometimes representing a "frames per second" count.
  // param {Number} level
  // param {String} message='default'
  // param {Object} meta
  // _fps(level, name = 'default', {count = 10, ...meta} = {}) {
  // @returns {Function} - log function (should be called immediately by app)
  fps(...args) {
    return this._fps(1, ...args);
  }

  fps1(...args) {
    return this._fps(1, ...args);
  }

  fps2(...args) {
    return this._fps(2, ...args);
  }

  fps3(...args) {
    return this._fps(3, ...args);
  }

  // Display a measurement from an external source, such as a server,
  // inline with other local measurements in the style of Probe's output.
  // _externalProbe(level, name, timeStart, timeSpent, meta) {
  // @returns {Function} - log function (should be called immediately by app)
  externalProbe(...args) {
    return this._externalProbe(1, ...args);
  }

  externalProbe1(...args) {
    return this._externalProbe(1, ...args);
  }

  externalProbe2(...args) {
    return this._externalProbe(2, ...args);
  }

  externalProbe3(...args) {
    return this._externalProbe(3, ...args);
  }

  // Only log first time
  first(level, name, message = '', meta = {}) {
    let logFunc = noop;
    if (!this._firstStore[name]) {
      this._firstStore[name] = {
        time: formatTime(getTimestamp()),
        message
      };

      const nameAndMessage = `${name} ${message}`;
      logger.timeStamp(nameAndMessage);

      logFunc = this._probe(...[level, nameAndMessage, Object.assign({}, meta, {info: true})]);
    }
    return logFunc;
  }

  firstTable(tail) {
    this._firstStore['INTERACTIVE PERCENTAGE'] = {
      time: formatTime(getTimestamp()),
      message: `${this.getInteractiveRatio() * 100}%`
    };
    const rows = tail ? this._firstStore.slice(-tail) : this._firstStore;
    logger.table(rows);
  }

  // Start a group
  group(name) {
    return new Group(this, name);
  }

  // Run a function only when probe is enabled
  run(func, arg) {
    const isEnabled = this._getOption('isEnabled');
    const isRunEnabled = this._getOption('isRunEnabled');
    if (isEnabled && isRunEnabled) {
      func(arg);
    }
    return this;
  }

  // Conditionally run a function only when probe is enabled
  // If condition is a string, it will be looked up as an option
  runIf(condition, func, arg) {
    if (typeof condition === 'string') {
      condition = Boolean(this._getOption(condition));
    }
    return condition ? this.run(func, arg) : this;
  }

  // Show current log in a table, if supported by console
  // @param {Number} tail If supplied, show only the last n entries
  // @returns {Probe} - returns itself for chaining
  table(tail) {
    const isEnabled = this._getOption('isEnabled');
    if (isEnabled && typeof logger.table === 'function') {
      const rows = tail ? this._logStore.slice(-tail) : this._logStore;
      logger.table(rows);
    }
    return this;
  }

  // PROFILING

  getInteractiveRatio() {
    const time = getTimestamp();
    const ratio = this.interactiveHeartbeats * INTERACTIVE_CHECK_TIMEOUT / time;
    return ratio.toPrecision(3);
  }

  // DEPRECATED METHODS

  // xprobe functionality is now enabled in default probes
  // Returns the bound logging function for application to call
  // Experiment to get console source code links to app instead of probe
  xprobe(...args) {
    const logFunc = this._probe(...args);
    return logFunc;
  }

  // Returns the bound logging function for application to call
  // Experiment to get console source code links to app instead of probe
  xsample(...args) {
    return this._sample(...args);
  }

  xfps(...args) {
    return this._fps(...args);
  }

  xExternalProbe(...args) {
    return this._externalProbe(...args);
  }

  xfirst(level, name, message = '', meta = {}) {
    return this.first(...arguments);
  }

  // PRIVATE METHODS

  _probe(level, name, meta) {
    let logFunc = noop;
    if (this._shouldLog(level)) {
      logFunc = this._log(level, name, meta);
    }
    return logFunc;
  }

  _sample(level, name, meta) {
    let logFunc = noop;
    if (this._shouldLog(level)) {
      const samples = this._sampleStore;

      const probeData = samples[name] || (
        samples[name] = {timeSum: 0, count: 0, averageTime: 0}
      );
      probeData.timeSum += getTimestamp() - this._deltaTs;
      probeData.count += 1;
      probeData.averageTime = probeData.timeSum / probeData.count;

      logFunc = this._log(level, name, Object.assign({}, meta, {
        averageTime: probeData.averageTime
      }));

      // Weight more heavily on later samples. Otherwise it gets almost
      // impossible to see outliers after a while.
      if (probeData.count === 10) {
        probeData.count = 5;
        probeData.timeSum /= 2;
      }
    }
    return logFunc;
  }

  _getFpsData(name) {
    let fpsData = this._fpsStore[name];
    if (!fpsData) {
      fpsData = {totalCount: 0, count: 0, time: getTimestamp()};
      Object.seal(fpsData);
      this._fpsStore[name] = fpsData;
    }
    return fpsData;
  }

  _fps(level, name = 'default', opts = {}) {
    const {count = 10, head = 0} = opts;
    let logFunc = noop;
    if (this._shouldLog(level)) {
      const fpsData = this._getFpsData(name);
      ++fpsData.totalCount;
      ++fpsData.count;
      // Only log every "count" probes, skipping others
      if (fpsData.count >= count) {
        const fps = fpsData.count / (getTimestamp() - fpsData.time) * 1000;
        fpsData.count = 0;
        fpsData.time = getTimestamp();
        logFunc = this._log(level, name, Object.assign({}, opts, {fps}));
      // But... always log the first "head" probes
      } else if (fpsData.totalCount < head) {
        logFunc = this._probe(level, name, opts);
      }
    }
    return logFunc;
  }

  _externalProbe(level, name, timeStart, timeSpent, meta) {
    let logFunc = noop;
    if (this._shouldLog(level)) {
      // External probes are expected to provide epoch getTimestamps
      const total = timeStart - this._startEpochTs;
      const delta = timeSpent;
      logFunc = this._log(level, name, Object.assign({total, delta}, meta));
    }
    return logFunc;
  }

  _initConfig({ignoreEnvironment = false} = {}) {
    // Use default config as base and override it with environment
    this._config = Object.assign({}, DEFAULT_CONFIG);
    if (!ignoreEnvironment) {
      try {
        // Protect against an exception when parsing config
        const config = this._getConfigFromEnvironment();
        // Walk through the loaded config to make sure it is well formatted
        // This ensures that we don't break when loading environments written
        // by incompatible versions of probe.
        for (const key in config) {
          const {value} = config[key];
          // assert(value);
          const doc = config[key].doc || 'N/A';
          // assert(typeof doc === 'string');
          this._config[key] = {value, doc};
        }
      } catch (error) {
        logger.error('Probe failed to read config, resetting environment');
        this._config = Object.assign({}, DEFAULT_CONFIG);
        this._updateEnvironment();
      }
    }
  }

  // Get config from persistent store, if available
  _getConfigFromEnvironment() {
    let customConfig = {};
    if (isBrowser) {
      const serialized = this.storage.get(PROBE_STORAGE_KEY_NAME);
      if (serialized) {
        customConfig = JSON.parse(serialized);
      }
    } else {
      // TODO - get config from Node's command line arguments
    }
    return Object.assign({}, DEFAULT_CONFIG, customConfig);
  }

  _updateEnvironment() {
    if (isBrowser) {
      const serialized = JSON.stringify(this._config);
      this.storage.set(PROBE_STORAGE_KEY_NAME, serialized);
    }
    // Support chaining
    return this;
  }

  _getElapsedTime() {
    const total = Number((getTimestamp() - this._startTs).toPrecision(10));
    const delta = Number((getTimestamp() - this._deltaTs).toPrecision(10));
    // reset delta timer
    this._deltaTs = getTimestamp();
    return {total, delta};
  }

  _shouldLog(probeLevel) {
    const isEnabled = this._getOption('isEnabled');
    const isLogEnabled = this._getOption('isLogEnabled');
    const level = this.getLevel();
    return isEnabled && isLogEnabled && level >= probeLevel;
  }

  _log(level, name, meta = {}) {
    const isPrintEnabled = this._getOption('isPrintEnabled');
    const useIndirectLogging = this._getOption('useIndirectLogging');

    const logRow = this._createLogRow({level, name}, meta);
    this._logStore.push(logRow);
    // Log to console if enabled
    let logFunction = noop;
    if (isPrintEnabled) {
      const line = this._formatLogRowForConsole(logRow);
      logFunction = logRow.info ? logger.info : logger.debug;
      logFunction = logFunction.bind(logger, line);
    }
    if (useIndirectLogging) {
      logFunction();
      logFunction = noop;
    }
    return logFunction;
  }

  _createLogRow(opts) {
    const {total, delta} = this._getElapsedTime();
    const logRow = Object.assign({total, delta}, opts);

    // duration handling
    const {name} = opts;
    if (opts.start) {
      this._startStore[name] = getTimestamp();
    } else if (opts.end) {
      // If start isn't found, take the full duration since initialization
      const start = this._startStore[name] || this._startTs;
      logRow.duration = getTimestamp() - start;
    }

    return logRow;
  }

  // Nicer console logging
  _formatLogRowForConsole(logRow) {
    const delta = formatTime(logRow.delta);
    const total = formatTime(logRow.total);
    const fps = logRow.fps ? `FPS ${logRow.fps.toPrecision(2)}` : '';
    const indent = logRow.indent || '';
    return `${indent} ${leftPad(total)} ${leftPad(delta)}  ` +
      `${logRow.name} ${fps}`;
  }

  // Calls a timer and counts how many times it fires.
  // This is used to calculate percentage of elapsed time that system
  // was not loaded.
  _startInteractiveHearbeat() {
    this.interactiveHeartbeats = 0;
    if (isBrowser) {
      setInterval(() => {
        this.interactiveHeartbeats++;
      }, INTERACTIVE_CHECK_TIMEOUT);
    }
  }
}
