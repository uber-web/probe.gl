const KB = 1024;
const MB = 1024 * KB;
const GB = 1024 * MB;

// t in milliseconds
export function formatTime(t) {
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
export function formatMemory(b) {
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
