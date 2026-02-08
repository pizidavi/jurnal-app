/**
 * Formats date to a human-readable format
 */
export const formateDate = (date: Date | number) => {
  if (typeof date === 'number') {
    date = new Date(date);
  }
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
