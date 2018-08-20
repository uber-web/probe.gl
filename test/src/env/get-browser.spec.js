/* eslint-disable max-len */
import test from 'tape-catch';
import {getBrowser} from 'probe.gl/env';

test('getBrowser', t => {
  t.equal(getBrowser('Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)'),
    'IE', 'should return IE for IE 10');

  t.equal(getBrowser('Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko'),
    'IE', 'should return IE for IE 11');

  t.equal(getBrowser('Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0'),
    'Edge', 'should return Edge for IE 12');

  t.end();
});
