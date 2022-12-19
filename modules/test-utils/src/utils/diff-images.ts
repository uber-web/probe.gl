import fs from 'fs';
// eslint-disable-next-line  import/no-extraneous-dependencies
import {PNG} from 'pngjs';
import pixelmatch from 'pixelmatch';

type ImageType = unknown;

export type DiffImagesOptions = {
  threshold?: number; // 0.99,
  createDiffImage?: boolean; // false,
  tolerance?: number; // 0.1,
  includeAA?: boolean; // false,
  includeEmpty?: boolean; // true
};

export type DiffImagesResult = {
  success: boolean;
  error?: string;
  match: number;
  matchPercentage: string;
  diffImage: any;
  source1: string | Buffer;
  source2: string;
  options: unknown;
};

export default async function diffImages(
  source1: string | Buffer,
  source2: string,
  options: DiffImagesOptions = {}
): Promise<DiffImagesResult> {
  try {
    const [image1, image2] = await Promise.all([parsePNG(source1), parsePNG(source2)]);
    const result = diffPNGs(image1, image2, options);
    return {
      ...result,
      source1,
      source2,
      options
    };
  } catch (error: unknown) {
    // @ts-expect-error - partially populated result
    return {
      success: false,
      error: (error as Error).message
    };
  }
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

  const diffImage = new PNG({width, height});

  // pixelmatch returns the number of mismatched pixels
  const mismatchedPixels = pixelmatch(
    image1.data, // image 1
    image2.data, // image 2
    diffImage.data, // output
    width, // width
    height, // height
    {threshold: tolerance, includeAA} // options
  );

  const pixelCount = includeEmpty ? width * height : countNonEmptyPixels(image1.data, image2.data);

  const match = 1 - mismatchedPixels / pixelCount;
  const success = match >= threshold;

  return {
    match,
    matchPercentage: `${(match * 100).toFixed(2)}%`,
    success,
    diffImage: !success && createDiffImage ? encodePNG(diffImage) : null
  };
}

function countNonEmptyPixels(data1, data2) {
  const pixels1 = new Uint8Array(data1.buffer);
  const pixels2 = new Uint8Array(data2.buffer);
  let count = 0;
  for (let i = 3; i < pixels1.length; i += 4) {
    // Exclude a pixel if it's empty in both images
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    if ((pixels1[i] as number) > 0 || (pixels2[i] as number) > 0) {
      count++;
    }
  }
  return count;
}

// TODO - replace pngjs with @loaders.gl/images
function parsePNG(source: string | Buffer): ImageType {
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

function encodePNG(image: ImageType): string | null {
  if (!image) {
    return null;
  }
  const buffer = PNG.sync.write(image, {});
  return `data:image/png;base64,${buffer.toString('base64')}`;
}
