import getHiResTimestamp from '../utils/hi-res-timestamp';

export default class Stat {
  constructor(name, formatter) {
    this.name = name;
    this.reset();
    this._formatter = formatter;
    this.numLines = this.getLines().length;
  }

  // Call to bump a accumulator (+1)
  incrementCount() {
    this.addCount(1);
  }

  // Call to bump a accumulator (+1)
  decrementCount() {
    this.subtractCount(1);
  }

  // Call to bump a accumulator
  addCount(value) {
    this.count += value;
  }

  // Call to bump a accumulator
  subtractCount(value) {
    this.count -= value;
  }

  addTime(time) {
    this.time += time;
    this.lastTiming = time;
    this.count++;
  }

  timeStart() {
    this._startTime = getHiResTimestamp();
  }

  timeEnd() {
    this.addTime(getHiResTimestamp() - this._startTime);
  }

  getAverageTime() {
    return this.time / this.count;
  }

  getHz() {
    return this.count / (this.time / 1000);
  }

  reset() {
    this.time = 0;
    this.count = 0;
    this.lastTiming = 0;
    this._startTime = 0;
  }

  toString() {
    return this._formatter(this);
  }

  getLines() {
    return this._formatter(this).split('\n');
  }
}
