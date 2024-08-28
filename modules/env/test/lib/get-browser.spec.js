/* eslint-disable max-len */
import test from 'tape-promise/tape';
import {getBrowser} from '@probe.gl/env';

test('getBrowser', (t) => {
  t.equal(
    getBrowser(
      'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0'
    ),
    'Edge',
    'should return Edge for IE 12'
  );

  t.end();
});
