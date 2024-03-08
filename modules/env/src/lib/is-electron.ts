// based on https://github.com/cheton/is-electron
// https://github.com/electron/electron/issues/2288
/* eslint-disable complexity */
export function isElectron(mockUserAgent?: string): boolean {
  // Renderer process
  // @ts-expect-error
  if (typeof window !== 'undefined' && window.process?.type === 'renderer') {
    return true;
  }
  // Main process
  // eslint-disable-next-line
  if (typeof process !== 'undefined' && Boolean(process.versions?.['electron'])) {
    return true;
  }
  // Detect the user agent when the `nodeIntegration` option is set to true
  const realUserAgent = typeof navigator !== 'undefined' && navigator.userAgent;
  const userAgent = mockUserAgent || realUserAgent;
  return Boolean(userAgent && userAgent.indexOf('Electron') >= 0);
}
