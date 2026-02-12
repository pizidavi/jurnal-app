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
