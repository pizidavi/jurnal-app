/* eslint-disable no-process-env */

// Env variables
export const APP_ENV: 'production' | 'preview' | 'development' =
  process.env.EXPO_PUBLIC_ENVIRONMENT ?? 'development';

// Constants
export const DATABASE_NAME = 'database.db';
