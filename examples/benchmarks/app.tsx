// probe.gl benchmark example
import React, {PureComponent} from 'react';
import {render} from 'react-dom';

import {Bench, LogEntry} from '@probe.gl/bench';
import {BenchResults} from '@probe.gl/react-bench';

import addBenchmarks from '../../test/bench/samples.bench';

type LogItem = {
  id: string;
  value?;
  formattedValue?;
  formattedError?;
};

const addReferenceBenchmarks = false;

function parseSIPrefix(itersPerSecond: string): number {
  const value = parseFloat(itersPerSecond);
  const prefix = itersPerSecond[itersPerSecond.length - 1];
  switch (prefix) {
    case 'M':
      return value * 1000000;
    case 'K':
      return value * 1000;
    default:
      return value;
  }
}

type AppProps = {};

export default class App extends PureComponent<AppProps> {
  constructor(props: AppProps) {
    super(props);

    addBenchmarks(this.suite, addReferenceBenchmarks);
  }

  override componentDidMount() {
    this.suite
      // Calibrate performance
      // @ts-ignore
      .calibrate()
      .run()
      // when running in browser, notify test the driver that it's done
      .then(() => {});
  }

  suite: Bench = new Bench({log: this._addResultToLog.bind(this)});
  log: LogItem[] = [];

  _addResultToLog(logEntry: LogEntry) {
    switch (logEntry.type) {
      case 'group':
        this.log.push({id: logEntry.id});
        break;
      case 'test':
        const value = parseSIPrefix(logEntry.itersPerSecond);
        // log.push(`├─ ${id}: ${itersPerSecond} iterations/s ±${(error * 100).toFixed(2)}%`);
        this.log.push({
          id: logEntry.id,
          value,
          formattedValue: logEntry.itersPerSecond,
          formattedError: `${(logEntry.error * 100).toFixed(2)}%`
        });
        break;
      case 'complete':
        break;
      default:
    }
    this.forceUpdate();
  }

  override render() {
    return (
      <div>
        <BenchResults log={this.log} />
      </div>
    );
  }
}

export function renderToDOM(container) {
  render(<App />, container);
}
