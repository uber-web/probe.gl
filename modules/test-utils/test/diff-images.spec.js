import test from 'tape-promise/tape';
import {isBrowser} from 'probe.gl';

import {_diffImages as diffImages} from '@probe.gl/test-utils';

test('diffImage', async t => {
  if (isBrowser()) {
    t.comment('diffImage is node only');
    t.end();
    return;
  }
  const {resolve} = require('path');
  const dataDir = resolve(__dirname, './data');

  const TEST_CASES = [
    {
      title: 'identical images',
      source1: resolve(dataDir, 'icon-marker.png'),
      source2: resolve(dataDir, 'icon-marker-2.png'),
      testMatch: match => match === 1,
      success: true
    },
    {
      title: 'aliased edges',
      source1: resolve(dataDir, 'icon-marker.png'),
      source2: resolve(dataDir, 'icon-marker-blur.png'),
      success: true
    },
    {
      title: 'aliased edges',
      source1: resolve(dataDir, 'icon-marker.png'),
      source2: resolve(dataDir, 'icon-marker-blur.png'),
      success: true
    },
    {
      title: 'aliased edges',
      source1: resolve(dataDir, 'icon-marker.png'),
      source2: resolve(dataDir, 'icon-marker-blur.png'),
      options: {includeAA: true},
      success: false
    },
    {
      title: 'color difference',
      source1: resolve(dataDir, 'icon-marker.png'),
      source2: resolve(dataDir, 'icon-marker-color.png'),
      options: {threshold: 0.5},
      success: true
    },
    {
      title: 'color difference',
      source1: resolve(dataDir, 'icon-marker.png'),
      source2: resolve(dataDir, 'icon-marker-color.png'),
      options: {threshold: 0.5, includeEmpty: false},
      success: false
    },
    {
      title: 'non-existent file',
      source1: resolve(dataDir, 'icon-marker.png'),
      source2: resolve(dataDir, 'non-existent.png'),
      success: false
    }
  ];

  for (const testCase of TEST_CASES) {
    const result = await diffImages(testCase.source1, testCase.source2, testCase.options);
    t.comment(`${testCase.title}: ${result.match}`);
    t.is(result.success, testCase.success, 'returns correct result');
  }

  t.end();
});
