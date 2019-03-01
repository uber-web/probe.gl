import getHiResTimestamp from '../utils/hi-res-timestamp';

export default class Timer {
  constructor() {
    this.reset();
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

  getAverage() {
    return this.time / this.count;
  }

  getHz() {
    return this.count / this.time;
  }

  reset() {
    this.time = 0;
    this.count = 0;
    this.lastTiming = 0;
    this._startTime = 0;
  }
}
