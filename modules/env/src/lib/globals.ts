export const global = globalThis;
// eslint-disable-next-line consistent-this
export const self = globalThis.self || globalThis.window || globalThis.global;
export const window = (globalThis.window ||
  globalThis.self ||
  globalThis.global) as unknown as Window;
export const document = globalThis.document || ({} as Document);
export const process = globalThis.process || ({} as NodeJS.Process);
export const console = globalThis.console;
export const navigator = globalThis.navigator || ({} as Navigator);
