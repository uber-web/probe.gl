import Stat from './stat';

export default class Stats {
  constructor({id}) {
    this.id = id;
    this.stats = {};
    Object.seal(this);
  }

  // Acquire a stat. Create if it doesn't exist.
  get(name) {
    this.stats[name] = this.stats[name] || new Stat(name);
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

  getTable() {
    const table = {};
    this.forEach(stat => {
      table[stat.name] = {
        time: stat.time || 0,
        count: stat.count || 0,
        average: stat.getAverageTime() || 0,
        hz: stat.getHz() || 0
      };
    });

    return table;
  }
}
