"use strict";module.export({default:()=>isBrowser,isBrowserMainThread:()=>isBrowserMainThread});var isElectron;module.link('./is-electron',{default(v){isElectron=v}},0);// This function is needed in initialization stages,
// make sure it can be imported in isolation
/* global process */



function isBrowser() {
  // Check if in browser by duck-typing Node context
  const isNode =
    typeof process === 'object' && String(process) === '[object process]' && !process.browser;

  return !isNode || isElectron();
}

// document does not exist on worker thread
function isBrowserMainThread() {
  return isBrowser() && typeof document !== 'undefined';
}
