/* global setInterval, clearInterval */
import React, {Component} from 'react';
import {render} from 'react-dom';
import {StatsWidget} from '@probe.gl/stats-widget';
import {Stats} from 'probe.gl';

class App extends Component {
  constructor(props) {
    super(props);
    this._stats = new Stats({id: 'Stats Demo'});
    this._initialize();

    this._update = this._update.bind(this);
  }

  componentDidMount() {
    this._statsWidget = new StatsWidget(null, {
      container: this._container
    });

    this._intervalId = setInterval(this._update, 300);
  }

  componentWillUnmount() {
    // use intervalId from the state to clear the interval
    clearInterval(this._intervalId);
  }

  _initialize() {
    this._stats.get('Count', 'count');
    this._stats.get('Total Time', 'totalTime');
    this._stats.get('Average Time', 'averageTime');
    this._stats.get('Memory', 'memory');
    this._stats.get('FPS', 'fps');
  }

  _updateStats() {
    this._stats.get('Count').incrementCount();
    this._stats.get('Total Time').addTime(300);
    this._stats.get('Average Time').addTime(300);
    this._stats.get('FPS').addTime(300);
    this._stats.get('Memory').addCount(300);
  }

  _update() {
    const stat = this._stats.get('Count', 'count');
    if (stat.count === 0) {
      this._statsWidget.setStats(this._stats);
    }

    if (stat.count >= 10) {
      this._stats.reset();
    }

    this._updateStats();
    this._statsWidget.update();
  }

  render() {
    return <div id="stats-demo" ref={_ => (this._container = _)} />;
  }
}

export function renderToDOM(container) {
  render(<App />, container);
}
