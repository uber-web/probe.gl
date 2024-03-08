// Do not name these variables the same as the global objects - will break bundling
const global_ = globalThis;
const window_ = globalThis as unknown as Window;
const document_ = globalThis.document || ({} as Document);
const process_ = globalThis.process || {};
const console_ = globalThis.console;
const navigator_ = globalThis.navigator || ({} as Navigator);

export {
  global_ as global,
  global_ as self,
  window_ as window,
  document_ as document,
  process_ as process,
  console_ as console,
  navigator_ as navigator
};
