/* eslint-disable no-console */
const {document, console} = globalThis;

let old = null;

// Can log a (not too long) number of messages to a div in the DOM
// Set options to false to disable
export function enableDOMLogging(options = {}) {
  // First time, add a log div
  if (options && !old) {
    old = console.log.bind(console);
    console.log = (...args) => {
      // @ts-expect-error
      logLineToDOM(options, ...args);
      old(...args);
    };
  }
  if (!options && old) {
    console.log = old;
    old = null;
  }
}

let logDiv = null;

function logLineToDOM(options, message) {
  logDiv = options.container || logDiv;

  if (!logDiv) {
    logDiv = document.createElement('pre');
    document.body.append(logDiv);
  }

  // Add the line to the log element
  if (typeof message === 'string') {
    logDiv.innerHTML += `${message}\n`;

    if (options.getStyle) {
      Object.assign(logDiv.style, options.getStyle(message));
    }
  }
}

export default enableDOMLogging;
