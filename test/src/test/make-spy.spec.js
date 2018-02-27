import test from 'tape-catch';

import {makeSpy} from 'probe.gl/test';

test('import "probe.gl/test"', t => {
  t.ok(typeof makeSpy, 'makeSpy symbol imported');
  t.end();
});
