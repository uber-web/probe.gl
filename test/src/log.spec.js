import {Log} from 'probe.gl';
import test from 'tape-catch';

test('Log#import', t => {
  t.equals(typeof Log, 'function',
    'Expected row logged');
  t.end();
});

test('Log#log', t => {
  const log = new Log({id: 'test'});
  t.ok(log instanceof Log, 'log created successfully');
  t.doesNotThrow(
    () => log.log('test'),
    'log.log works'
  );
  t.end();
});
