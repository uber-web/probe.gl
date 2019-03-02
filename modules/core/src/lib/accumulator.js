const DEFAULT_FORMATTER = accumulator => [`${accumulator.name} : ${accumulator.total}`];

export default class Accumulator {
  constructor(name, formatter) {
    this.name = name;
    this.reset();
    this._formatter = formatter || DEFAULT_FORMATTER;
  }

  // Call to bump a accumulator (+1)
  bump() {
    this.add(1);
  }

  // Call to bump a accumulator
  add(value) {
    this.total += value;
  }

  reset() {
    this.total = 0;
  }

  getLines() {
    return this._formatter(this);
  }
}
