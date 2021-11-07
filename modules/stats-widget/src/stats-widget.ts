// Built on https://github.com/Erkaman/regl-stats-widget (MIT license)
// widget styling constants.
import {formatMemory, formatTime} from './format-utils';
import {Stats, Stat} from '@probe.gl/stats';

const RIGHT_ARROW = '\u25b6';
const DOWN_ARROW = '\u2b07';

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
    fontSize: '16px',
    cursor: 'pointer'
  },
  itemCSS: {
    paddingLeft: '8px'
  }
};

export type StatFormatter = (stat: Stat) => string;

export const DEFAULT_FORMATTERS: Record<string, StatFormatter> = {
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
  formatters?: Record<string, string | StatFormatter>;
  resetOnUpdate?: Record<string, boolean>;
};

export default class StatsWidget {
  stats: Stats;
  title: string;
  collapsed: boolean = false;
  _framesPerUpdate: number;
  _formatters = DEFAULT_FORMATTERS;
  _css;
  _headerCSS;
  _itemCSS;
  _container: HTMLElement | null = null;
  _innerContainer: HTMLElement = null;
  _statsContainer: HTMLElement = null;
  _header: HTMLElement = null;
  _resetOnUpdate: Record<string, boolean> = {};
  _counter: number = 0;
  _items = {};
  _added: boolean = false;

  constructor(stats: Stats, options?: StatWidgetProps) {
    this.stats = stats;
    this.title = options?.title;

    this._framesPerUpdate = Math.round(Math.max(options?.framesPerUpdate || 1, 1));

    this._initializeFormatters(options);
    this._initializeUpdateConfigs(options);

    // UI
    this._css = Object.assign({}, DEFAULT_CSS.css, options?.css);
    this._headerCSS = Object.assign({}, DEFAULT_CSS.headerCSS, this._css.header);
    this._itemCSS = Object.assign({}, DEFAULT_CSS.itemCSS, this._css.item);

    delete this._css.header;
    delete this._css.item;

    this._createDOM(options?.container);
    this._createDOMStats();
  }

  setStats(stats: Stats): void {
    this.stats = stats;
    this._createDOMStats();
    this._setHeaderContent();

    this.update();
  }

  update(): void {
    // compatible with the old API
    // TODO should call stats.size
    const stats = this.stats && this.stats.stats;
    if (!stats || Object.keys(stats).length === 0) {
      return;
    }

    if (this._counter++ % this._framesPerUpdate !== 0) {
      return;
    }

    this._update();
  }

  /**
   * Remove the stats widget from the container it was added to.
   * The stats widget cannot be reused after this is called.
   */
  remove(): void {
    // if re-adding the stats widget is needed, a code path to
    // re-add the _innerContainer should be added, e.g. in _update.
    this._container.removeChild(this._innerContainer);
  }

  setCollapsed(collapsed: boolean): void {
    this.collapsed = collapsed;
    if (this._statsContainer) {
      this._statsContainer.style.display = this.collapsed ? 'none' : 'block';
    }
    this._setHeaderContent();
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
    if (options?.formatters) {
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
    if (options?.resetOnUpdate) {
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

    // When adding the widget to an existing element, make sure there
    // is a container for this widget specifically, so that multiple widgets
    // can be added to the same container.
    this._innerContainer = document.createElement('div');
    this._container.appendChild(this._innerContainer);

    // Create the contents of the stats widget, starting with the header
    this._createDOMHeader();

    // Create an element for the stats themselves, so we can collapse it later
    this._statsContainer = document.createElement('div');
    this._statsContainer.style.display = 'block';
    this._innerContainer.appendChild(this._statsContainer);
  }

  _createDOMHeader(): void {
    // header
    if (!this._header) {
      this._header = document.createElement('div');
      for (const name in this._headerCSS) {
        this._header.style[name] = this._headerCSS[name];
      }
      this._header.onclick = this._toggleCollapsed.bind(this);
      this._innerContainer.appendChild(this._header);
    }

    this._setHeaderContent();
  }

  _setHeaderContent() {
    if (this._header) {
      const collapsedState = this.collapsed ? RIGHT_ARROW : DOWN_ARROW;
      const title = this.title || (this.stats && this.stats.id) || 'Stats';
      this._header.innerText = `${collapsedState} ${title}`;
    }
  }

  _toggleCollapsed() {
    this.setCollapsed(!this.collapsed);
  }

  _createDOMStats(): void {
    if (this.stats instanceof Stats) {
      this.stats.forEach(stat => {
        this._createDOMItem(stat.name);
      });
    }
  }

  _createDOMItem(statName: string): void {
    if (!this._statsContainer) {
      return;
    }

    if (this._items[statName]) {
      return;
    }

    this._items[statName] = document.createElement('div');
    for (const name in this._itemCSS) {
      this._items[statName].style[name] = this._itemCSS[name];
    }
    this._statsContainer.appendChild(this._items[statName]);
  }

  _getLines(stat: Stat): string[] {
    const formatter =
      this._formatters[stat.name] || this._formatters[stat.type] || DEFAULT_FORMATTERS.count;
    return formatter(this.stats.get(stat.name)).split('\n');
  }
}
