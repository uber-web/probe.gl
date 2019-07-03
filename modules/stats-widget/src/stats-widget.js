// Built on https://github.com/Erkaman/regl-stats-widget (MIT license)
// widget styling constants.
/* global document */

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

const DEFAULT_FORMATTERS = {
  count: stat => `${stat.name}: ${stat.count}`,
  averageTime: stat => `${stat.name}: ${formatTime(stat.getAverageTime())}`,
  totalTime: stat => `${stat.name}: ${formatTime(stat.time)}`,
  fps: stat => `${stat.name}: ${Math.round(stat.getHz())}fps`,
  memory: stat => `${stat.name}: ${formatMemory(stat.count)}`
};

const KB = 1024;
const MB = 1024 * KB;
const GB = 1024 * MB;

export default class StatsWidget {
  constructor(stats, opts = {}) {
    this.title = opts.title || null;
    this.stats = stats;
    this._css = Object.assign({}, DEFAULT_CSS.css, opts.css);
    this._headerCSS = Object.assign({}, DEFAULT_CSS.headerCSS, this._css.header);
    this._itemCSS = Object.assign({}, DEFAULT_CSS.itemCSS, this._css.item);

    delete this._css.header;
    delete this._css.item;

    this._container = null;
    this._header = null;
    this._items = {};
    this._counter = 0;
    this._framesPerUpdate = Math.round(Math.max(opts.framesPerUpdate || 1, 1));
    this._formatters = {};
    this._resetOnUpdate = {};

    if (opts.formatters) {
      for (const name in opts.formatters) {
        let fm = opts.formatters[name];

        if (typeof fm === 'string') {
          fm = DEFAULT_FORMATTERS[fm];
        }

        this._formatters[name] = fm;
      }
    }

    if (opts.resetOnUpdate) {
      for (const name in opts.resetOnUpdate) {
        this._resetOnUpdate[name] = opts.resetOnUpdate[name];
      }
    }

    this._createDOM(opts.container);
  }

  update() {
    if (this._counter++ % this._framesPerUpdate !== 0) {
      return;
    }

    // make sure that we clear the old text before drawing new text.
    this.stats.forEach(stat => {
      this._createDOMItem(stat.name);
      this._items[stat.name].innerHTML = this._getLines(stat.name).join('<BR>');

      if (this._resetOnUpdate[stat.name]) {
        stat.reset();
      }
    });
  }

  _createDOM(container) {
    if (!document) {
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

    this._header = document.createElement('div');
    this._header.innerText = this.title || this.stats.id;
    for (const name in this._headerCSS) {
      this._header.style[name] = this._headerCSS[name];
    }
    this._container.appendChild(this._header);

    this.stats.forEach(stat => {
      this._createDOMItem(stat.name);
    });
  }

  _createDOMItem(statName) {
    if (!document) {
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

  _getLines(name) {
    const formatter = this._formatters[name] || DEFAULT_FORMATTERS.count;
    return formatter(this.stats.get(name)).split('\n');
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
