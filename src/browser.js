// This function is needed in initialization stages,
// make sure it can be imported in isolation

/* global navigator, window, process */

// Simple browser detection
function detectBrowser() {
  /* global process */
  const isNode =
    typeof process === 'object' &&
    String(process) === '[object process]' &&
    !process.browser;
  if (isNode) {
    return 'Node';
  }

  /* global navigator */
  const {userAgent} = navigator;
  if (userAgent.indexOf('Chrome') > -1) {
    return 'Chrome';
  }
  if (userAgent.indexOf('Firefox') > -1) {
    return 'Firefox';
  }
  if (userAgent.indexOf('Safari') > -1) {
    return 'Safari';
  }
  if (userAgent.indexOf('MSIE') > -1) {
    return navigator.appVersion.indexOf('Trident') > -1 ? 'IE11' : 'Edge';
  }
  return 'Unknown';
}

export const BROWSER = detectBrowser();

export const isBrowser = BROWSER !== 'Node';

export const isMobile =
  typeof window.orientation !== 'undefined' ||
  navigator.userAgent.indexOf('IEMobile') > -1;

export default isBrowser;
