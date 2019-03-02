import getHiResTimestamp from '../utils/hi-res-timestamp';

const DEFAULT_FORMATTER = timer => [
  `${timer.name}: `,
  `    Total time: ${timer.time.toFixed(2)}ms`,
  `    Average time: ${timer.getAverage().toFixed(2)}ms`,
  `    Hz: ${timer.getHz().toFixed(1)}`
];

export default class Timer {
  constructor(name, formatter) {
    this.name = name;
    this.reset();
    this._formatter = formatter || DEFAULT_FORMATTER;
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
    return this.count / (this.time / 1000);
  }

  reset() {
    this.time = 0;
    this.count = 0;
    this.lastTiming = 0;
    this._startTime = 0;
  }

  getLines() {
    return this._formatter(this);
  }
}
