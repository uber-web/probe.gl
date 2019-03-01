/* global window */
import {Stats} from 'probe.gl';
import {StatsWidget} from '@probe.gl/stats-widget';

const stats = new Stats({id: 'test-stats'});
const accum = stats.addAccumulator('test-accum');
const statsWidget = new StatsWidget(stats, {
  containerStyle: 'position:fixed;bottom:0;right:0;z-index:1'
});

const onAnimationFrame = () => {
  accum.bump('draw call 1');
  if (Math.random() < 0.1) {
    accum.bump('draw call 2');
  }
  statsWidget.update();
  window.requestAnimationFrame(onAnimationFrame);
};
onAnimationFrame();
