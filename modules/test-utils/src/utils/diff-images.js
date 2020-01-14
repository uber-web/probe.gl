import fs from 'fs';
import {PNG} from 'pngjs';
import pixelmatch from 'pixelmatch';

export default function diffImages(source1, source2, options = {}) {
  return Promise.all([parsePNG(source1), parsePNG(source2)])
    .then(([image1, image2]) => diffPNGs(image1, image2, options))
    .catch(error => ({
      success: false,
      error: error.message
    }))
    .then(result =>
      Object.assign(result, {
        source1,
        source2,
        options
      })
    );
}

function diffPNGs(image1, image2, options) {
  const {width, height} = image1;
  if (width !== image2.width || height !== image2.height) {
    throw new Error('Image sizes do not match');
  }

  const {
    threshold = 0.99,
    createDiffImage = false,
    tolerance = 0.1,
    includeAA = false,
    includeEmpty = true
  } = options;

  const diffImage = createDiffImage ? new Uint8Array(width * height) : null;

  // pixelmatch returns the number of mismatched pixels
  const mismatchedPixels = pixelmatch(
    image1.data, // image 1
    image2.data, // image 2
    diffImage, // output
    width, // width
    height, // height
    {threshold: tolerance, includeAA} // options
  );

  const pixelCount = includeEmpty
    ? width * height
    : Math.min(getNonEmptyPixels(image1.data), getNonEmptyPixels(image2.data));

  const match = 1 - mismatchedPixels / pixelCount;

  return {
    match,
    matchPercentage: `${(match * 100).toFixed(2)}%`,
    success: match >= threshold,
    diffImage
  };
}

function getNonEmptyPixels(data) {
  const pixels = new Uint8Array(data.buffer);
  let count = 0;
  for (let i = 3; i < pixels.length; i += 4) {
    if (pixels[i] > 0) {
      count++;
    }
  }
  return count;
}

// TODO - replace pngjs with @loaders.gl/images
function parsePNG(source) {
  const image = new PNG();
  if (typeof source === 'string') {
    // url or local path
    return new Promise((resolve, reject) => {
      const readStream = fs.createReadStream(source).on('error', reject);
      readStream.pipe(image).on('parsed', () => resolve(image));
    });
  }
  if (source instanceof Buffer) {
    // puppeteer.screenshot returns a Buffer object
    return new Promise((resolve, reject) => {
      image.parse(source, (error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve(image);
        }
      });
    });
  }
  return Promise.reject(new Error('Unknown image source'));
}
