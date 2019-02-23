"use strict";var test;module.link('tape-catch',{default(v){test=v}},0);var makeSpy;module.link('@probe.gl/test-utils',{makeSpy(v){makeSpy=v}},1);



test('import "probe.gl/test"', t => {
  t.ok(typeof makeSpy, 'makeSpy symbol imported');
  t.end();
});
