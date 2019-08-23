/* global global, window */
import test from 'tape-catch';
import {Stats} from 'probe.gl';
import {StatsWidget} from '@probe.gl/stats-widget';

const _global = typeof global === 'undefined' ? window : global;

const stats = new Stats({id: 'test-stats'});
const statsContent = [
  {
    name: 'Count',
    type: 'count'
  },
  {
    name: 'Total Time',
    type: 'totalTime'
  },
  {
    name: 'Memory',
    type: 'memory'
  }
];

statsContent.forEach(({name, type}) => {
  stats.get(name, type);
});

test('StatsWidget#import', t => {
  t.equals(typeof StatsWidget, 'function', 'Stats import OK');
  t.end();
});

test('StatsWidget#Constructor with no stats or options', t => {
  const statsWidget = new StatsWidget(null);
  t.ok(statsWidget._container, 'Should create a dom container.');
  t.ok(statsWidget._header, 'Should create a dom header.');
  t.equals(statsWidget._container.childNodes.length, 1, 'Should have one child node.');
  t.ok(
    statsWidget._container.childNodes[0] === statsWidget._header,
    'Should append header to container as the first child'
  );
  t.end();
});

test('StatsWidget#Constructor with container', t => {
  const container = _global.document.createElement('div');
  container.id = 'test-stats-widget-container';
  const statsWidget = new StatsWidget(null, {container});
  t.ok(statsWidget._container === container);
  t.end();
});

test('StatsWidget#setStats', t => {
  const container = _global.document.createElement('div');
  container.id = 'test-stats-widget-container';
  const statsWidget = new StatsWidget(null, {container});
  t.equals(Object.keys(statsWidget._items).length, 0, 'Should have no items when no stats.');
  statsWidget.setStats(stats);
  t.equals(Object.keys(statsWidget._items).length, 3, 'Should have 3 items.');
  t.equals(statsWidget._container.childNodes.length, 4, 'Should have 4 child nodes.');

  t.end();
});

test('StatsWidget#Update stats', t => {
  const container = _global.document.createElement('div');
  container.id = 'test-stats-widget-container';
  const statsWidget = new StatsWidget(null, {container});
  statsWidget.setStats(stats);

  stats.get('Count').incrementCount();
  statsWidget.update();

  t.equals(Object.keys(statsWidget._items).length, 3, 'Should have 3 items.');
  t.equals(statsWidget._container.childNodes.length, 4, 'Should have 4 child nodes.');

  t.equals(statsWidget._items.Count.innerHTML, 'Count: 1', 'Should correctly update count stats.');

  stats.get('Memory').addCount(1500);
  statsWidget.update();

  t.equals(
    statsWidget._items.Memory.innerHTML,
    'Memory: 1.46kB',
    'Should correctly update memory stats.'
  );

  t.end();
});
