import {document} from './globals';

let old = null;
let logDiv = null;

// Can log a (not too long) number of messages to a div in the DOM
export function logToDOM(message) {
  // First time, add a log div
  if (!old) {
    /* eslint-disable no-console */
    /* global console */
    old = console.log.bind(console);
    console.log = (...args) => {
      logLineToDOM(...args);
      old(...args);
    };
  }
}

function logLineToDOM(message) {
  if (!logDiv) {
    logDiv = document.createElement('div');
  }
  // Ensure the element comes first
  const {childNodes} = document.body;
  document.body.insertBefore(logDiv, childNodes && childNodes[0]);

  // Add the line to the log element
  const line = typeof message === 'object' ?
    `${JSON && JSON.stringify ? JSON.stringify(message) : message}<br />` :
    `${message}<br />`;
  logDiv.innerHTML += line;
}

export default logToDOM;
