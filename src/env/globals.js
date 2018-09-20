/* global self, window, global, document, console, process */
const globals = {
  self: typeof self !== 'undefined' && self,
  window: typeof window !== 'undefined' && window,
  global: typeof global !== 'undefined' && global,
  document: typeof document !== 'undefined' && document,
  process: typeof process === 'object' && process
};

const self_ = globals.self || globals.window || globals.global;
const window_ = globals.window || globals.self || globals.global;
const global_ = globals.global || globals.self || globals.window;
const document_ = globals.document || {};
const process_ = globals.process || {};
const console_ = console;

export {
  self_ as self,
  window_ as window,
  global_ as global,
  document_ as document,
  process_ as process,
  console_ as console
};
