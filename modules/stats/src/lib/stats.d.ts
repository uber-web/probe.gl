import Stat from './stat';

/** A "bag" of `Stat` objects, can be visualized using `StatsWidget` */
export default class Stats {
  readonly size: number;

  constructor(args: {id: string; stats?: Stats | (Stat | {name: string; type?: string})[]});

  /** Acquire a stat. Create if it doesn't exist. */
  get(name: string, type?: string): Stat;

  /** Reset all stats */
  reset(): Stats;

  forEach(fn: (stat: Stat) => void): void;

  getTable(): {
    time: number;
    count: number;
    average: number;
    hz: number;
  }[];
}
