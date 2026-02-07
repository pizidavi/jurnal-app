import { type ClassNameValue, twMerge } from 'tailwind-merge';

/**
 * Sleep
 * @param ms Time to sleep in milliseconds
 */
export const sleep = (ms = 1000) => new Promise<void>(resolve => setTimeout(resolve, ms));

/**
 * Tailwind classnames merger
 * @param classNames Classnames
 * @return Merged classnames
 */
export const clx = (...classNames: ClassNameValue[]) => twMerge(...classNames);
