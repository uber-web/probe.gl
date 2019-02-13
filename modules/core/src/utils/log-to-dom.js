/* eslint-disable no-console */
import {document, console} from './globals';

let old = null;

// Can log a (not too long) number of messages to a div in the DOM
export function enableDOMLogging(enable = {}) {
  // First time, add a log div
  if (enable && !old) {
    old = console.log.bind(console);
    console.log = (...args) => {
      logLineToDOM(enable, ...args);
      old(...args);
    };
  }
  if (!enable && old) {
    console.log = old;
    old = null;
  }
}

let logDiv = null;

function logLineToDOM(opts, message) {
  logDiv = opts.container || logDiv;

  if (!logDiv) {
    logDiv = document.createElement('pre');
    document.body.append(logDiv);
  }

  // Add the line to the log element
  if (typeof message === 'string') {
    logDiv.innerHTML += `${message}\n`;

    if (opts.getStyle) {
      Object.assign(logDiv.style, opts.getStyle(message));
    }
  }
}

export default enableDOMLogging;
