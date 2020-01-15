import test from 'tape-catch';
import {Stats} from '@probe.gl/stats';
import {StatsWidget} from '@probe.gl/stats-widget';

const _global = typeof global === 'undefined' ? window : global;

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
    name: 'GPU Memory',
    type: 'memory'
  }
];

function getStatsObject() {
  const stats = new Stats({id: 'test-stats'});
  statsContent.forEach(({name, type}) => {
    stats.get(name, type);
  });
  return stats;
}

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
  const stats = getStatsObject();

  t.equals(Object.keys(statsWidget._items).length, 0, 'Should have no items when no stats.');

  statsWidget.setStats(stats);

  t.equals(Object.keys(statsWidget._items).length, 3, 'Should have 3 items.');
  t.equals(statsWidget._container.childNodes.length, 4, 'Should have 4 child nodes.');
  t.equals(statsWidget._counter, 1, 'Should call update() and increase _counter.');

  t.end();
});

/* eslint-disable */
test('StatsWidget#Update stats', t => {
  const container = _global.document.createElement('div');
  container.id = 'test-stats-widget-container';
  const statsWidget = new StatsWidget(null, {container});
  const stats = getStatsObject();

  statsWidget.setStats(stats);

  stats.get('Count').incrementCount();
  statsWidget.update();

  t.equals(Object.keys(statsWidget._items).length, 3, 'Should have 3 items.');
  t.equals(statsWidget._container.childNodes.length, 4, 'Should have 4 child nodes.');

  t.equals(statsWidget._items.Count.innerHTML, 'Count: 1', 'Should correctly update count stats.');

  stats.get('GPU Memory').addCount(1500);
  statsWidget.update();

  t.equals(
    statsWidget._items['GPU Memory'].innerHTML,
    'GPU Memory: 1.46kB',
    'Should correctly update memory stats.'
  );

  t.end();
});

test('StatsWidget#formatters', t => {
  const container = _global.document.createElement('div');
  container.id = 'test-stats-widget-container';
  const statsWidget = new StatsWidget(null, {
    container,
    formatters: {
      'GPU Memory': 'count',
      Count: stat => `${stat.name}: ${(stat.count / 1000).toFixed(1)}k`
    }
  });
  const stats = getStatsObject();

  statsWidget.setStats(stats);

  stats.get('Count').addCount(1000);
  stats.get('GPU Memory').addCount(1500);
  statsWidget.update();

  t.equals(statsWidget._items.Count.innerHTML, 'Count: 1.0k', 'Should use customized formatter.');
  t.equals(
    statsWidget._items['GPU Memory'].innerHTML,
    'GPU Memory: 1500',
    'Should use customized formatter.'
  );

  statsWidget.setStats(new Stats({id: 'test-stats-2'}));
  t.equals(statsWidget._header.innerText, 'test-stats-2', "Should use the new stats' header.");

  t.end();
});

test('StatsWidget#resetOnUpdate', t => {
  const container = _global.document.createElement('div');
  container.id = 'test-stats-widget-container';
  const statsWidget = new StatsWidget(null, {
    container,
    resetOnUpdate: {Count: true}
  });
  const stats = getStatsObject();

  statsWidget.setStats(stats);

  stats.get('Count').addCount(1000);
  stats.get('GPU Memory').addCount(1500);
  statsWidget.update();

  t.equals(stats.get('Count').count, 0, 'Should reset count.');
  t.equals(stats.get('GPU Memory').count, 1500, 'Should not reset memory.');

  t.end();
});
