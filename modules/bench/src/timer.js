let timer;

// Get best timer available.
if (typeof performance !== 'undefined') {
  timer = () => {
    return performance.now();
  };
} else if (typeof process !== 'undefined') {
  timer = () => {
    const timeParts = process.hrtime();
    return timeParts[0] * 1000 + timeParts[1] / 1e6;
  };
} else {
  timer = () => {
    return Date.now();
  };
}

export default timer;
