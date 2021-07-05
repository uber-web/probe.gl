import babel from '@babel/core';
import plugin from '../index';
import test from 'tape-catch';

const TEST_CASES = [
  {
    title: 'invalid filename',
    input: "log.log(1, 'The page is loaded')();",
    opts: {removeLogs: true, patterns: ['**/*.jsx']},
    output: "log.log(1, 'The page is loaded')();"
  },
  {
    title: 'removeLogs',
    input: "log.log(1, 'The page is loaded')();",
    opts: {removeLogs: true},
    output: ''
  },
  {
    title: 'default removeLogs',
    input: "log.log(1, 'The page is loaded')();",
    opts: {},
    output: "log.log(1, 'The page is loaded')();"
  },
  {
    title: 'removeLogs disabled',
    input: "log.log(1, 'The page is loaded')();",
    opts: {removeLogs: false},
    output: "log.log(1, 'The page is loaded')();"
  },
  {
    title: 'custom removeLogs rule',
    input: "log.log(1, 'The page is loaded')();",
    opts: {removeLogs: ['log']},
    output: ''
  },
  {
    title: 'custom removeLogs rule',
    input: "log.log(1, 'The page is loaded')();",
    opts: {removeLogs: ['warn']},
    output: "log.log(1, 'The page is loaded')();"
  },
  {
    title: 'complex',
    input: `
  import log from 'probe.gl';

  canvas.addEventListener('click', evt => {
    log.log(1, \`The user clicked the canvas: ($\{evt.pageX\}, $\{evt.pageY\})\`)();
    try {
      redraw();
    } catch (error) {
      log.warn(error.message)();
    }
  });`,
    opts: {removeLogs: true},
    output: `
  import log from 'probe.gl';

  canvas.addEventListener('click', evt => {
    try {
      redraw();
    } catch (error) {
      log.warn(error.message)();
    }
  });`
  }
];

// Remove whitespace before comparing
function clean(code) {
  return code
    .replace('"use strict";', '')
    .replace(/\n\s+/g, '\n')
    .trim();
}

/* eslint-disable */
test('Probe.gl Babel Plugin', t => {
  TEST_CASES.forEach(testCase => {
    const {code} = babel.transform(testCase.input, {
      plugins: [[plugin, testCase.opts]],
      filename: 'test.js',
      configFile: false
    });
    t.is(clean(code), clean(testCase.output), testCase.title);
  });

  t.end();
});
