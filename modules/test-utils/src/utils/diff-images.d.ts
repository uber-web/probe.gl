export default function diffImages(
  source1,
  source2,
  options?: object
): {
  match: string;
  matchPercentage: string;
  success: boolean;
  diffImage: any;
};
