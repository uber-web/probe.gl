import Accumulator from './accumulator';
import Timer from './timer';

export default class Stats {
  constructor({id}) {
    this.id = id;
    this.accumulators = {};
    this.timers = {};
    Object.seal(this);
  }

  // Initialize a new accumulator
  addAccumulator(name) {
    this.accumulators[name] = new Accumulator();
    return this.accumulators[name];
  }

  // Initialize a new timer
  addTimer(name) {
    this.timers[name] = new Timer();
    return this.timers[name];
  }

  // Initialize a new accumulator
  getAccumulator(name) {
    return this.accumulators[name];
  }

  // Initialize a new timer
  getTimer(name) {
    return this.timers[name];
  }

  // Reset all stats
  reset() {
    for (const key in this.accumulators) {
      this.accumulators[key].reset();
    }

    for (const key in this.timers) {
      this.timers[key].reset();
    }

    return this;
  }

  getStats() {
    const stats = {};
    for (const key in this.accumulators) {
      const accumulator = this.accumulators[key];
      stats[key] = {
        total: accumulator.total
      };
    }

    for (const key in this.timers) {
      const timer = this.timers[key];
      stats[key] = {
        time: timer.time,
        count: timer.count,
        averageTime: timer.getAverage(),
        hz: timer.getHz()
      };
    }
    return stats;
  }

  // Return stats in a "table format" suitable for console.table() or Log.table()
  getStatsTable() {
    const stats = this.getStats();
    for (const key in stats) {
      if (stats[key].count === 0 || stats[key].total === 0) {
        delete stats[key];
      }
    }
    return stats;
  }

  // Returns the names of all registered accumulators, enables iteration
  getAccumulatorNames() {
    return Object.keys(this.accumulators);
  }

  // Returns the names of all registered timers, enables iteration
  getTimerNames() {
    return Object.keys(this.timers);
  }
}
