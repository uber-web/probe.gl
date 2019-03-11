// Built on https://github.com/Erkaman/regl-stats-widget (MIT license)
/* eslint-disable */
// widget styling constants.

const DEFAULT_STYLES = {
  containerStyle: 'position:fixed;z-index:10000;',
  width: 160,
  color: '#ccc',
  background: '#000',
  padding: [8, 8],
  fontFamily: 'Helvetica,Arial,sans-serif',
  fontSize: 12,
  lineSpacing: 6,
  headerSize: 16
};

const DEFAULT_FORMATTERS = {
  count: stat => `${stat.name}: ${stat.count}`,
  time: stat => `${stat.name}: ${formatTime(stat.getAverageTime())}`,
  fps: stat => `${stat.name}: ${Math.round(stat.getHz())}fps`,
  memory: stat => `${stat.name}: ${formatMemory(stat.count)}`,
};

const KB = 1024;
const MB = 1024 * KB;
const GB = 1024 * MB;

export default class StatsWidget {
  constructor(stats, opts = {}) {
    this.title = opts.title || null;
    this.lastUpdateTime = 0;
    this.stats = stats;
    this.styles = Object.assign({}, DEFAULT_STYLES, opts.styles);
    this._formatters = {};
    if (opts.formatters) {
      for (const name in opts.formatters) {
        let fm = opts.formatters[name];

        if (typeof fm === 'string') {
          fm = DEFAULT_FORMATTERS[fm];
        }

        this._formatters[name] = fm;
      }
    }

    this._createDOM();
  }

  update() {
    const timestamp = Date.now();

    if (timestamp - this.lastUpdateTime > 1000) {
      this.lastUpdateTime = timestamp;

      const {context, devicePixelRatio, styles} = this;
      const textCursor = [
        styles.padding[0],
        styles.padding[1] + styles.headerSize + styles.lineSpacing
      ];

      // make sure that we clear the old text before drawing new text.
      this._clearTextArea();
      this._drawHeader();
      context.font = `${styles.fontSize * devicePixelRatio}px ${styles.fontFamily}`;

      this.stats.forEach(stat => {
        const lines = this._getLines(stat.name);
        const numLines = lines.length;

        for (let i = 0; i < numLines; ++i) {
          context.fillText(
            lines[i],
            textCursor[0] * devicePixelRatio,
            textCursor[1] * devicePixelRatio
          );
          textCursor[1] += styles.fontSize + styles.lineSpacing;
        }
      });
    }
  }

  _createDOM() {
    let {container} = this.styles;
    const pr = Math.round(window.devicePixelRatio || 1);

    // the widget is contained in a <div>
    if (!container) {
      container = document.createElement('div');
      container.style.cssText = this.styles.containerStyle;
      document.body.appendChild(container);
    }

    // we draw the widget on a canvas.
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    container.appendChild(canvas);

    this.context = context;
    this.devicePixelRatio = Math.round(window.devicePixelRatio || 1);
  }

  _drawHeader() {
    const {context, devicePixelRatio, styles} = this;
    context.font = `${styles.headerSize * devicePixelRatio}px ${styles.fontFamily}`;
    context.fillText(
      this.title || this.stats.id,
      styles.padding[0] * devicePixelRatio,
      styles.padding[1] * devicePixelRatio
    );
  }

  _clearTextArea() {
    const {context, devicePixelRatio, styles} = this;
    let statsCount = 0;

    this.stats.forEach(stat => {
      statsCount += this._getLines(stat.name).length;
    });

    const width = styles.width;
    const height =
      styles.headerSize +
      statsCount * (styles.fontSize + styles.lineSpacing) +
      styles.padding[1] * 2;
    context.canvas.width = width * devicePixelRatio;
    context.canvas.height = height * devicePixelRatio;
    context.canvas.style.width = `${width}px`;
    context.canvas.style.height = `${height}px`;

    // draw background
    context.fillStyle = styles.background;
    context.fillRect(0, 0, width * devicePixelRatio, height * devicePixelRatio);

    context.fillStyle = styles.color;
    context.textBaseline = 'top';
  }

  _getLines(name) {
    const formatter = this._formatters[name] || DEFAULT_FORMATTERS.count;
    return formatter(this.stats.get(name)).split('\n');
  }
}

// t in milliseconds
function formatTime(t) {
  let value, unit, precision;
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
  let value, unit, precision;
  if (b < KB) {
    value = b;
    unit = ' bytes';
    precision = 0;
  } else if (t < MB) {
    value = b / KB;
    unit = 'kB';
    precision = 2;
  } else if (t < GB) {
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
