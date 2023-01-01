// @ts-nocheck

import test from 'tape-promise/tape';
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
  t.ok(
    statsWidget._innerContainer.parentElement === statsWidget._container,
    'Should append inner container to container'
  );
  t.ok(
    statsWidget._innerContainer.childNodes[0] === statsWidget._header,
    'Should append header to inner container as the first child'
  );
  t.ok(
    statsWidget._innerContainer.childNodes[1] === statsWidget._statsContainer,
    'Should append stats container to inner container as the second child'
  );
  statsWidget.remove();
  t.end();
});

test('StatsWidget#Constructor with container', t => {
  const container = _global.document.createElement('div');
  container.id = 'test-stats-widget-container';
  const statsWidget = new StatsWidget(null, {container});
  t.ok(statsWidget._container === container);
  statsWidget.remove();
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
  t.equals(statsWidget._container.childNodes.length, 1, 'Should have 2 child nodes.');
  t.equals(statsWidget._innerContainer.childNodes.length, 2, 'Should have 2 child nodes.');
  t.equals(statsWidget._statsContainer.childNodes.length, 3, 'Should have 3 child nodes.');
  t.equals(statsWidget._counter, 1, 'Should call update() and increase _counter.');

  statsWidget.remove();
  t.end();
});

test('StatsWidget#collapse', t => {
  const container = _global.document.createElement('div');
  container.id = 'test-stats-widget-container';
  const statsWidget = new StatsWidget(getStatsObject(), {container});

  t.ok(!statsWidget.collapsed, 'Starts uncollapsed');
  t.equals(statsWidget._statsContainer.style.display, 'block', 'Starts in block display');

  statsWidget.setCollapsed(true);

  t.ok(statsWidget.collapsed, 'Collapses');
  t.equals(statsWidget._statsContainer.style.display, 'none', 'Collapses to none display');

  statsWidget.setCollapsed(false);

  t.ok(!statsWidget.collapsed, 'Uncollapses');
  t.equals(statsWidget._statsContainer.style.display, 'block', 'Uncollapses to block display');

  statsWidget.remove();
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

  // @ts-expect-error
  t.equals(Object.keys(statsWidget._items).length, 3, 'Should have 3 items.');
  // @ts-expect-error
  t.equals(statsWidget._container.childNodes.length, 1, 'Should have 1 child nodes.');
  t.equals(statsWidget._innerContainer.childNodes.length, 2, 'Should have 2 child nodes.');
  t.equals(statsWidget._statsContainer.childNodes.length, 3, 'Should have 3 child nodes.');

  // @ts-expect-error
  t.equals(statsWidget._items.Count.innerHTML, 'Count: 1', 'Should correctly update count stats.');

  stats.get('GPU Memory').addCount(1500);
  statsWidget.update();

  t.equals(
    // @ts-expect-error
    statsWidget._items['GPU Memory'].innerHTML,
    'GPU Memory: 1.46kB',
    'Should correctly update memory stats.'
  );

  statsWidget.remove();
  t.end();
});

test('StatsWidget#formatters', t => {
  // @ts-expect-error
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

  // @ts-expect-error
  t.equals(statsWidget._items.Count.innerHTML, 'Count: 1.0k', 'Should use customized formatter.');
  t.equals(
    // @ts-expect-error
    statsWidget._items['GPU Memory'].innerHTML,
    'GPU Memory: 1500',
    'Should use customized formatter.'
  );

  statsWidget.setStats(new Stats({id: 'test-stats-2'}));
  // @ts-expect-error
  t.equals(
    statsWidget._header.innerText,
    '\u2b07 test-stats-2',
    "Should use the new stats' header."
  );

  statsWidget.remove();
  t.end();
});

test('StatsWidget#resetOnUpdate', t => {
  // @ts-expect-error
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

  statsWidget.remove();
  t.end();
});

test('StatsWidget#remove', t => {
  const container = _global.document.createElement('div');
  container.id = 'test-stats-widget-container';
  const statsWidget = new StatsWidget(null, {container});
  t.ok(statsWidget._container === container);
  t.equals(statsWidget._container.childNodes.length, 1, 'Should have 1 child node.');
  statsWidget.remove();
  t.equals(statsWidget._container.childNodes.length, 0, 'Should have 0 child nodes.');
  t.end();
});
