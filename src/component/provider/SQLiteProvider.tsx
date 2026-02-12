import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { useEffect } from 'react';
import { View } from 'react-native';
import migrations from '../../../drizzle/migrations';
import { db, expoDatabase } from '../../config/client';
import { appLog } from '../../util/logger';
import ActivityIndicator from '../common/ActivityIndicator';
import LocaleText from '../common/LocaleText';

function SQLiteProvider({ children }: { children: React.ReactNode }) {
  if (__DEV__)
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      require('expo-drizzle-studio-plugin').useDrizzleStudio(expoDatabase);
    } catch (error) {
      appLog.warn('Failed to initialize Drizzle Studio:', error);
    }

  // Hook
  const { success, error } = useMigrations(db, migrations);

  // Effect
  useEffect(() => {
    if (error)
      appLog.error('Failed to run migrations:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
  }, [error]);

  // Render
  return error || !success ? (
    <View className='flex-1 items-center justify-center bg-background'>
      {error ? (
        <LocaleText text='migration:failed' className='text-center' />
      ) : (
        <View className='items-center justify-center gap-base'>
          <LocaleText text='migration:inProgress' className='text-muted-foreground' />
          <ActivityIndicator size='large' color='primary' />
        </View>
      )}
    </View>
  ) : (
    children
  );
}

export default SQLiteProvider;
