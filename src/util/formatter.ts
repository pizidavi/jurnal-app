/**
 * Formats date to a human-readable format
 */
export const formatDate = (date: Date | number) => {
  if (typeof date === 'number') {
    date = new Date(date);
  }
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Formats bytes to a human-readable format (decimal units)
 */
export const formatBytes = (bytes: number): string => {
  if (bytes <= 1000) return `${bytes} B`;
  const units = ['KB', 'MB', 'GB', 'TB'];
  let value = bytes / 1000;
  let unitIndex = 0;
  while (value >= 1000 && unitIndex < units.length - 1) {
    value /= 1000;
    unitIndex += 1;
  }
  return `${value.toFixed(1)} ${units[unitIndex]}`;
};
