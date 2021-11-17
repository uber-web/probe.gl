import {normalizeArguments} from '@probe.gl/log/log';
import test from 'tape-promise/tape';

function makeOpts(logLevel, message, ...args) {
  return {logLevel, message, args: arguments};
}

const NORMALIZE_ARGUMENTS_TEST_CASES = [
  {
    args: makeOpts(1, 'Hi', 0, 1),
    opts: {logLevel: 1, message: 'Hi', args: [0, 1]}
  },
  {
    args: makeOpts('Hi', 0, 1),
    opts: {logLevel: 0, message: 'Hi', args: [0, 1]}
  },
  {
    args: makeOpts({}, 'Hi', 0, 1),
    opts: {logLevel: 0, message: 'Hi', args: [0, 1]}
  },
  {
    args: makeOpts({logLevel: 3, color: 'green'}, 'Hi', 0, 1),
    opts: {logLevel: 3, color: 'green', message: 'Hi', args: [0, 1]}
  }
  // {
  //   args: makeOpts({logLevel: 3, color: 'green', message: 'Hi', args: [0, 1]}),
  //   opts: {logLevel: 3, color: 'green', message: 'Hi', args: [0, 1]}
  // }
];

test.only('normalizeArguments', t => {
  debugger;
  for (const tc of NORMALIZE_ARGUMENTS_TEST_CASES) {
    const opts = normalizeArguments({...tc.args});

    t.deepEqual(
      opts,
      tc.opts,
      `log(${JSON.stringify(tc.args)}) => ${JSON.stringify(opts)} args parsed correctly`
    );
  }
  t.end();
});
