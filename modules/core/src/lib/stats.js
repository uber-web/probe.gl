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
  addAccumulator(name, formatter) {
    this.accumulators[name] = new Accumulator(name, formatter);
    return this.accumulators[name];
  }

  // Initialize a new timer
  addTimer(name, formatter) {
    this.timers[name] = new Timer(name, formatter);
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

  forEach(fn) {
    for (const key in this.accumulators) {
      fn(this.accumulators[key]);
    }

    for (const key in this.timers) {
      fn(this.timers[key]);
    }
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
