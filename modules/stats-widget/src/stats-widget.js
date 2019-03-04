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

const TAB_SIZE = 8;

export default class StatsWidget {
  constructor(statsInstance, styles) {
    this.lastUpdateTime = 0;
    this.instance = statsInstance;
    this.styles = Object.assign({}, DEFAULT_STYLES, styles);
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

      this.instance.forEach(stat => {
        const lines = stat.getLines();
        const numLines = lines.length;

        for (let i = 0; i < numLines; ++i) {
          const tab = i === 0 ? 0 : 8;
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
      this.instance.id,
      styles.padding[0] * devicePixelRatio,
      styles.padding[1] * devicePixelRatio
    );
  }

  _clearTextArea() {
    const {context, devicePixelRatio, styles} = this;
    let statsCount = 0;

    this.instance.forEach(stat => {
      statsCount += stat.numLines;
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
}
