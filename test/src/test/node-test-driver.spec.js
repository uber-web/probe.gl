import test from 'tape-catch';

import {NodeTestDriver} from 'probe.gl/test';

test('Top-level imports', t => {
  t.ok(NodeTestDriver, 'NodeTestDriver symbol imported');
  t.end();
});
