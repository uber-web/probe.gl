"use strict";var test;module.link('tape-catch',{default(v){test=v}},0);var BrowserDriver;module.link('@probe.gl/test-utils',{BrowserDriver(v){BrowserDriver=v}},1);



test('BrowserDriver#import', t => {
  t.ok(BrowserDriver, 'BrowserDriver symbol imported');
  t.end();
});
