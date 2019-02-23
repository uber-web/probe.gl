// TODO - dummy benchmark - should replace with log related benchmark
import {Bench} from '@probe.gl/bench';

const suite = new Bench({
  id: 'test'
});

suite.group('probe.gl: No self benchmarks available yet (yarn test runs bench tests)');

suite.run();
