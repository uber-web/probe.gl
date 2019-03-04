import Stat from './stat';

export default class Stats {
  constructor({id}) {
    this.id = id;
    this.stats = {};
    Object.seal(this);
  }

  // Initialize a new stat
  create(name) {
    this.stats[name] = new Stat(name);
    return this.stats[name];
  }

  // Get existing stat
  get(name) {
    return this.stats[name];
  }

  // Reset all stats
  reset() {
    for (const key in this.stats) {
      this.stats[key].reset();
    }

    return this;
  }

  forEach(fn) {
    for (const key in this.stats) {
      fn(this.stats[key]);
    }
  }
}
