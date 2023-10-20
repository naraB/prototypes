export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}
export function formatMilliseconds(ms: number): string {
  'worklet';

  // Convert milliseconds to total seconds
  const totalSeconds = Math.floor(ms / 1000);

  // Calculate minutes and seconds
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  // Format to "mm:ss"
  return `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
}

export function clamp(x: number, min: number, max: number) {
  'worklet';

  return Math.min(Math.max(x, min), max);
}
