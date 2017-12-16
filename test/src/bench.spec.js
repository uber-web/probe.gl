import {Bench} from 'probe.gl';
import test from 'tape-catch';

import colorBench from './color.bench';

test('Bench#import', t => {
  t.equals(typeof Bench, 'function',
    'Expected row logged');
  t.end();
});

test('Bench#constructor', t => {
  const suite = new Bench({id: 'test'});
  t.ok(suite instanceof Bench, 'suite created successfully');
  t.end();
});

test('Bench#run', t => {
  const suite = new Bench({
    id: 'test',
    log: t.comment.bind(t)
  });

  colorBench(suite);

  t.ok(suite instanceof Bench, 'suite created successfully');
  suite.run().then(
    () => t.end()
  );
});
