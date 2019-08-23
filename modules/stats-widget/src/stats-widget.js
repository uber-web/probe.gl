// Built on https://github.com/Erkaman/regl-stats-widget (MIT license)
// widget styling constants.
/* global document */

import {STAT_TYPES} from 'probe.gl';

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

const KB = 1024;
const MB = 1024 * KB;
const GB = 1024 * MB;

const DEFAULT_FORMATTERS = {
  [STAT_TYPES.count]: stat => `${stat.name}: ${stat.count}`,
  [STAT_TYPES.averageTime]: stat => `${stat.name}: ${formatTime(stat.getAverageTime())}`,
  [STAT_TYPES.totalTime]: stat => `${stat.name}: ${formatTime(stat.time)}`,
  [STAT_TYPES.fps]: stat => `${stat.name}: ${Math.round(stat.getHz())}fps`,
  [STAT_TYPES.memory]: stat => `${stat.name}: ${formatMemory(stat.count)}`
};

export default class StatsWidget {
  constructor(props = {}) {
    this.stats = props.stats;
    this.title = props.title || null;

    this._framesPerUpdate = Math.round(Math.max(props.framesPerUpdate || 1, 1));
    this._formatters = DEFAULT_FORMATTERS;
    this._resetOnUpdate = {};

    this._counter = 0;

    this._initializeFormatters(props);
    this._initializeUpdateConfigs(props);

    // UI
    this._css = Object.assign({}, DEFAULT_CSS.css, props.css);
    this._headerCSS = Object.assign({}, DEFAULT_CSS.headerCSS, this._css.header);
    this._itemCSS = Object.assign({}, DEFAULT_CSS.itemCSS, this._css.item);

    delete this._css.header;
    delete this._css.item;

    this._container = null;
    this._header = null;
    this._items = {};

    this._createDOM(props.container);
  }

  setStats(stats) {
    this.stats = stats;
    this._createDOM(this._container);
  }

  update() {
    if (!this.stats.size) {
      return;
    }

    if (this._counter++ % this._framesPerUpdate !== 0) {
      return;
    }

    this._update();
  }

  _update() {
    // make sure that we clear the old text before drawing new text.
    this.stats.forEach(stat => {
      this._createDOMItem(stat.name);
      this._items[stat.name].innerHTML = this._getLines(stat).join('<BR>');

      if (this._resetOnUpdate[stat.name]) {
        stat.reset();
      }
    });
  }

  _initializeFormatters(props) {
    if (props.formatters) {
      for (const name in props.formatters) {
        let formatter = props.formatters[name];

        if (typeof formatter === 'string') {
          formatter = DEFAULT_FORMATTERS[formatter];
        }

        this._formatters[name] = formatter;
      }
    }
  }

  _initializeUpdateConfigs(props) {
    if (props.resetOnUpdate) {
      for (const name in props.resetOnUpdate) {
        this._resetOnUpdate[name] = props.resetOnUpdate[name];
      }
    }
  }

  _createDOM(container) {
    if (typeof document === 'undefined' || !document) {
      return;
    }

    if (!this.stats || !this.stats.size) {
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

    this._createDOMHeader();
    this._createDOMStats();
  }

  _createDOMHeader() {
    // header
    if (!this._header) {
      this._header = document.createElement('div');
      for (const name in this._headerCSS) {
        this._header.style[name] = this._headerCSS[name];
      }
      this._container.appendChild(this._header);
    }
    this._header.innerText = this.title || (this.stats && this.stats.id);
  }

  _createDOMStats() {
    this.stats.forEach(stat => {
      this._createDOMItem(stat.name);
    });
  }

  _createDOMItem(statName) {
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

  _getLines(stat) {
    const formatter = this._formatters[stat.type] || DEFAULT_FORMATTERS[STAT_TYPES.COUNT];
    return formatter(this.stats.get(stat.name)).split('\n');
  }
}

// t in milliseconds
function formatTime(t) {
  let value;
  let unit;
  let precision;

  if (t < 1) {
    value = t * 1000;
    unit = '\u03BCs';
    precision = 0;
  } else if (t < 1000) {
    value = t;
    unit = 'ms';
    precision = 2;
  } else {
    value = t / 1000;
    unit = 's';
    precision = 2;
  }

  return `${value.toFixed(precision)}${unit}`;
}

// b in bytes
function formatMemory(b) {
  let value;
  let unit;
  let precision;

  if (b < KB) {
    value = b;
    unit = ' bytes';
    precision = 0;
  } else if (b < MB) {
    value = b / KB;
    unit = 'kB';
    precision = 2;
  } else if (b < GB) {
    value = b / MB;
    unit = 'MB';
    precision = 2;
  } else {
    value = b / GB;
    unit = 'GB';
    precision = 2;
  }

  return `${value.toFixed(precision)}${unit}`;
}
