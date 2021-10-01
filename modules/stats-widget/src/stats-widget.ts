// Built on https://github.com/Erkaman/regl-stats-widget (MIT license)
// widget styling constants.
import {formatMemory, formatTime} from './format-utils';
import {Stats, Stat} from '@probe.gl/stats';

const DEFAULT_CSS = {
  css: {
    position: 'fixed',
    zIndex: 10000,
    color: '#ccc',
    background: '#000',
    fontFamily: 'Helvetica,Arial,sans-serif',
    padding: '8px',
    fontSize: '12px',
    lineSpacing: 6
  },
  headerCSS: {
    fontSize: '16px'
  },
  itemCSS: {
    paddingLeft: '8px'
  }
};

export const DEFAULT_FORMATTERS = {
  count: stat => `${stat.name}: ${stat.count}`,
  averageTime: stat => `${stat.name}: ${formatTime(stat.getAverageTime())}`,
  totalTime: stat => `${stat.name}: ${formatTime(stat.time)}`,
  fps: stat => `${stat.name}: ${Math.round(stat.getHz())}fps`,
  memory: stat => `${stat.name}: ${formatMemory(stat.count)}`
};

export type StatWidgetProps = {
  title?: string;
  framesPerUpdate?: number;
  css?: object;
  container?: HTMLElement;
  formatters?: {[type: string]: string | ((stat: Stat) => string)};
  resetOnUpdate?: {[statName: string]: boolean};
};

export default class StatsWidget {
  stats: Stats;
  title: string;
  _framesPerUpdate: number;
  _formatters;
  _resetOnUpdate = {};
  _counter = 0;
  _css;
  _headerCSS;
  _itemCSS;
  _container = null;
  _header = null;
  _items = {};

  constructor(stats: Stats, options?: StatWidgetProps) {
    stats = stats;
    this.title = options.title;

    this._framesPerUpdate = Math.round(Math.max(options.framesPerUpdate || 1, 1));
    this._formatters = DEFAULT_FORMATTERS;
    this._resetOnUpdate = {};

    this._counter = 0;

    this._initializeFormatters(options);
    this._initializeUpdateConfigs(options);

    // UI
    this._css = Object.assign({}, DEFAULT_CSS.css, options.css);
    this._headerCSS = Object.assign({}, DEFAULT_CSS.headerCSS, this._css.header);
    this._itemCSS = Object.assign({}, DEFAULT_CSS.itemCSS, this._css.item);

    delete this._css.header;
    delete this._css.item;

    this._container = null;
    this._header = null;
    this._items = {};

    this._createDOM(options.container);
    this._createDOMHeader();
    this._createDOMStats();
  }

  setStats(stats: Stats): void {
    this.stats = stats;
    // @ts-ignore
    this._createDOMStats(this._container);
    this._setHeaderContent(stats.id);

    this.update();
  }

  update(): void {
    // compatible with the old API
    // TODO should call stats.size
    // @ts-expect-error
    const stats = this.stats && this.stats.stats;
    if (!stats || Object.keys(stats).length === 0) {
      return;
    }

    if (this._counter++ % this._framesPerUpdate !== 0) {
      return;
    }

    this._update();
  }

  _update(): void {
    // make sure that we clear the old text before drawing new text.
    this.stats.forEach(stat => {
      this._createDOMItem(stat.name);
      this._items[stat.name].innerHTML = this._getLines(stat).join('<BR>');

      if (this._resetOnUpdate[stat.name]) {
        stat.reset();
      }
    });
  }

  _initializeFormatters(options?: StatWidgetProps): void {
    if (options.formatters) {
      for (const name in options.formatters) {
        let formatter = options.formatters[name];

        if (typeof formatter === 'string') {
          formatter = DEFAULT_FORMATTERS[formatter];
        }

        this._formatters[name] = formatter;
      }
    }
  }

  _initializeUpdateConfigs(options?: StatWidgetProps): void {
    if (options.resetOnUpdate) {
      for (const name in options.resetOnUpdate) {
        this._resetOnUpdate[name] = options.resetOnUpdate[name];
      }
    }
  }

  _createDOM(container: HTMLElement) {
    if (typeof document === 'undefined' || !document) {
      return;
    }

    this._container = container;

    // the widget is contained in a <div>
    if (!this._container) {
      this._container = document.createElement('div');
      for (const name in this._css) {
        this._container.style[name] = this._css[name];
      }
      document.body.appendChild(this._container);
    }
  }

  _createDOMHeader(): void {
    // header
    if (!this._header) {
      this._header = document.createElement('div');
      for (const name in this._headerCSS) {
        this._header.style[name] = this._headerCSS[name];
      }
      this._container.appendChild(this._header);
    }

    this._setHeaderContent();
  }

  _setHeaderContent(title?: string): void {
    if (this._header) {
      this._header.innerText = title || this.title || (this.stats && this.stats.id) || '';
    }
  }

  _createDOMStats(): void {
    if (this.stats instanceof Stats) {
      this.stats.forEach(stat => {
        this._createDOMItem(stat.name);
      });
    }
  }

  _createDOMItem(statName: string): void {
    if (!this._container) {
      return;
    }

    if (this._items[statName]) {
      return;
    }

    this._items[statName] = document.createElement('div');
    for (const name in this._itemCSS) {
      this._items[statName].style[name] = this._itemCSS[name];
    }
    this._container.appendChild(this._items[statName]);
  }

  _getLines(stat: Stat): string[] {
    const formatter =
      this._formatters[stat.name] || this._formatters[stat.type] || DEFAULT_FORMATTERS.count;
    return formatter(this.stats.get(stat.name)).split('\n');
  }
}
