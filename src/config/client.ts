import { QueryClient } from '@tanstack/react-query';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';
import * as schema from '../database/schema';
import { DATABASE_NAME } from './constant';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

export const expoDatabase = openDatabaseSync(DATABASE_NAME, { enableChangeListener: true });
export const db = drizzle(expoDatabase, { schema });
