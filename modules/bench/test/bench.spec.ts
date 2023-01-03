import test from 'tape-promise/tape';
import {Bench} from '@probe.gl/bench';

import iteratorBench from './iterator.bench';
import parseColorBench from './parse-color.bench';

test('Bench#import', t => {
  t.equals(typeof Bench, 'function', 'Expected row logged');
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
    log: ({message}) => t.comment(message)
  });

  suite.add('initFunc in options', {initialize: () => 1, unit: 'initializations'}, value => {
    // @ts-expect-error
    if (!value === 1) {
      t.fail();
    }
  });

  iteratorBench(suite);
  parseColorBench(suite);

  t.ok(suite instanceof Bench, 'suite created successfully');
  suite.run().then(() => t.end());
});
