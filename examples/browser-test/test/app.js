export function render() {
  const css = document.createElement('style');
  css.innerHTML = `
.app {
  display: inline-block;
  padding: 0 12px 0 0;
}
.arrow-box {
  position: relative;
  font-family: Arial;
  font-size: 20px;
  color: #fff;
  width: 80px;
  height: 20px;
  padding: 20px;
  background: #a00;
  border: 4px solid #f80;
}
.arrow-box:after, .arrow-box:before {
  left: 100%;
  top: 50%;
  border: solid transparent;
  content: " ";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}

.arrow-box:after {
  border-color: rgba(136, 183, 213, 0);
  border-left-color: #a00;
  border-width: 10px;
  margin-top: -10px;
}
.arrow-box:before {
  border-color: rgba(194, 225, 245, 0);
  border-left-color: #f80;
  border-width: 16px;
  margin-top: -16px;
}
  `;
  document.body.append(css);

  const div = document.createElement('div');
  div.className = 'app';
  const arrowBox = document.createElement('div');
  arrowBox.className = 'arrow-box';
  arrowBox.innerHTML = 'Hello';

  div.append(arrowBox);
  document.body.append(div);

  return div;
}
