// parseColor util from deck.gl - included as simple benchmark example

// Parse array or string color
function parseColor(color, target, index = 0) {
  if (Array.isArray(color) || ArrayBuffer.isView(color)) {
    if (!target && color.length === 4) {
      return color;
    }

    target = target || [];
    target[index + 0] = color[0];
    target[index + 1] = color[1];
    target[index + 2] = color[2];
    target[index + 3] = color.length === 4 ? color[4] : 255;
    return target;
  }

  if (typeof color === 'string') {
    target = target || [];
    parseHexColor(color, target, index);
    return target;
  }

  return [0, 0, 0, 255];
}

// Parse a hex color
function parseHexColor(color, target, index) {
  if (color.length === 7) {
    const value = parseInt(color.substring(1), 16);
    target[index + 0] = value / 65536;
    target[index + 1] = (value / 256) % 256;
    target[index + 2] = value % 256;
    target[index + 3] = 255;
  } else if (color.length === 9) {
    const value = parseInt(color.substring(1), 16);
    target[index + 0] = value / 16777216;
    target[index + 1] = (value / 65536) % 256;
    target[index + 2] = (value / 256) % 256;
    target[index + 3] = value % 256;
  }
  return index + 4;
}

// Named exports have a big perf hit in webpack, for micro utils, export as object
export default {parseColor};
