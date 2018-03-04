import test from 'tape-catch';

import {BrowserDriver} from 'probe.gl/test';

test('Top-level imports', t => {
  t.ok(BrowserDriver, 'BrowserDriver symbol imported');
  t.end();
});
