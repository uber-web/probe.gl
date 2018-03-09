// TODO - dummy benchmark - should replace with log related benchmark
import {Bench} from 'probe.gl/bench';

import colorBench from '../src/bench/parse-color.bench';

const suite = new Bench({
  id: 'test'
});

colorBench(suite);

suite.run();
