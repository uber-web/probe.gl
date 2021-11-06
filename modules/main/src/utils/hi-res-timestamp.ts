// probe.gl, MIT license

import {window, process, isBrowser} from './globals';

/** Get best timer available. */
export default function getHiResTimestamp() {
  let timestamp;
  // @ts-expect-error
  if (isBrowser && window.performance) {
    // @ts-expect-error
    timestamp = window.performance.now();
    // @ts-expect-error
  } else if (process.hrtime) {
    // @ts-expect-error
    const timeParts = process.hrtime();
    timestamp = timeParts[0] * 1000 + timeParts[1] / 1e6;
  } else {
    timestamp = Date.now();
  }

  return timestamp;
}
