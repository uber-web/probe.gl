export default class Accumulator {
  constructor() {
    this.reset();
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
}
