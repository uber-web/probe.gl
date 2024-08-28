import test from 'tape-promise/tape';
import {isBrowser} from '@probe.gl/env';

import {_diffImages as diffImages} from '@probe.gl/test-utils';

test('diffImage', async (t) => {
  if (isBrowser()) {
    t.comment('diffImage is node only');
    t.end();
    return;
  }
  const dataDir = './modules/test-utils/test/data';

  const TEST_CASES = [
    {
      title: 'identical images',
      source1: `${dataDir}/icon-marker.png`,
      source2: `${dataDir}/icon-marker-2.png`,
      testMatch: (match) => match === 1,
      success: true
    },
    {
      title: 'aliased edges',
      source1: `${dataDir}/icon-marker.png`,
      source2: `${dataDir}/icon-marker-blur.png`,
      success: true
    },
    {
      title: 'aliased edges',
      source1: `${dataDir}/icon-marker.png`,
      source2: `${dataDir}/icon-marker-blur.png`,
      success: true
    },
    {
      title: 'aliased edges',
      source1: `${dataDir}/icon-marker.png`,
      source2: `${dataDir}/icon-marker-blur.png`,
      options: {includeAA: true},
      success: false
    },
    {
      title: 'color difference',
      source1: `${dataDir}/icon-marker.png`,
      source2: `${dataDir}/icon-marker-color.png`,
      options: {threshold: 0.5},
      success: true
    },
    {
      title: 'color difference',
      source1: `${dataDir}/icon-marker.png`,
      source2: `${dataDir}/icon-marker-color.png`,
      options: {threshold: 0.5, includeEmpty: false},
      success: false
    },
    {
      title: 'non-existent file',
      source1: `${dataDir}/icon-marker.png`,
      source2: `${dataDir}/non-existent.png`,
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
