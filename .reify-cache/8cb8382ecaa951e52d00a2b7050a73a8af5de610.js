"use strict";var Bench;module.link('@probe.gl/bench',{Bench(v){Bench=v}},0);var test;module.link('tape-catch',{default(v){test=v}},1);var iteratorBench;module.link('./iterator.bench',{default(v){iteratorBench=v}},2);var parseColorBench;module.link('./parse-color.bench',{default(v){parseColorBench=v}},3);





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

  iteratorBench(suite);
  parseColorBench(suite);

  t.ok(suite instanceof Bench, 'suite created successfully');
  suite.run().then(() => t.end());
});
