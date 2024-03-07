// This function is needed in initialization stages,
// make sure it can be imported in isolation

import {isElectron} from './is-electron';

/** Check if in browser by duck-typing Node context */
export function isBrowser(): boolean {
  // @ts-expect-error
  const isNode = typeof process === 'object' && !process?.browser;
  return !isNode || isElectron();
}
