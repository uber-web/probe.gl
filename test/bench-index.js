import {Bench} from 'probe.gl';

import colorBench from './src/color.bench';

const suite = new Bench({
  id: 'test'
});

colorBench(suite);

suite.run();
