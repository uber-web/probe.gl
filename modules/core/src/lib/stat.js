import getHiResTimestamp from '../utils/hi-res-timestamp';

export default class Stat {
  constructor(name) {
    this.name = name;
    this.reset();
  }

  // Call to increment count (+1)
  incrementCount() {
    this.addCount(1);
  }

  // Call to decrement count (-1)
  decrementCount() {
    this.subtractCount(1);
  }

  // Increase count
  addCount(value) {
    this.count += value;
  }

  // Decrease count
  subtractCount(value) {
    this.count -= value;
  }

  // Add an abritrary timing and bump the count
  addTime(time) {
    this.time += time;
    this.lastTiming = time;
    this.count++;
  }

  // Start a timer
  timeStart() {
    this._startTime = getHiResTimestamp();
    this._timerPending = true;
  }

  // End a timer. Adds to time and bumps the timing count.
  timeEnd() {
    if (!this._timerPending) {
      return;
    }

    this.addTime(getHiResTimestamp() - this._startTime);
    this._timerPending = false;
  }

  // Calculate average time / count
  getAverageTime() {
    return this.count > 0 ? this.time / this.count : 0;
  }

  // Calculate counts per second
  getHz() {
    return this.time > 0 ? this.count / (this.time / 1000) : 0;
  }

  reset() {
    this.time = 0;
    this.count = 0;
    this.lastTiming = 0;
    this._startTime = 0;
    this._timerPending = false;
  }
}
