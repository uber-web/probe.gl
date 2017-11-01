/* global process, global, window, document */

// Provide fallbacks for browser globals
const window_ = typeof window !== 'undefined' ? window : global;
const document_ = typeof document !== 'undefined' ? document : {};

// Provide fallbacks for Node globals
const global_ = typeof global !== 'undefined' ? global : window;
const process_ = typeof process !== 'object' ? process : {};

// Check if in browser by duck-typing Node context
const isBrowser =
  typeof process !== 'object' ||
  String(process) !== '[object process]' ||
  process.browser;

export {
  window_ as window,
  document_ as document,
  global_ as global,
  process_ as process,
  isBrowser
};
