import test from 'tape-catch';

import {BrowserTestDriver} from 'probe.gl/test-utils';

test('Top-level imports', t => {
  t.ok(BrowserTestDriver, 'BrowserTestDriver symbol imported');
  t.end();
});
