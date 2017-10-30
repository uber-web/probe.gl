import {Logger} from 'probe.gl';
import test from 'tape';

test('Logger#import', t => {
  t.equals(typeof Logger, 'function',
    'Expected row logged');
});

test('Logger#log', t => {
  const log = new Logger({id: 'test'});

  t.doesNotThrow(
    () => log.log('test'),
    'log.log works');

  t.end();
});
