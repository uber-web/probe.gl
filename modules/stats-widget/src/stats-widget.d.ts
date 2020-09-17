// Built on https://github.com/Erkaman/regl-stats-widget (MIT license)
// widget styling constants.
import {Stats, Stat} from '@probe.gl/stats';

export default class StatsWidget {
  constructor(stats: Stats, options?: {
    title?: string;
    framesPerUpdate?: number;
    css?: object;
    container?: HTMLElement;
    formatters?: {[type: string]: string | ((stat: Stat) => string)};
    resetOnUpdate?: {[statName: string]: boolean};
  });

  setStats(stats: Stats): void;

  update(): void;
}
