import {Logger} from 'probe.gl';
import test from 'tape-catch';

test('Logger#import', t => {
  t.equals(typeof Logger, 'function',
    'Expected row logged');
  t.end();
});

test('Logger#log', t => {
  const log = new Logger({id: 'test'});
  t.ok(log instanceof Logger, 'log created successfully');
  t.doesNotThrow(
    () => log.log('test'),
    'log.log works'
  );
  t.end();
});
