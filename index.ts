// Expo
import { registerRootComponent } from 'expo';

// Libs
import notifee from 'react-native-notify-kit';

// App
import './src/locale';
import App from './src/App';
import { serviceLog } from './src/util/logger';
import type { NoteProcessingNotificationData } from './src/type/struct';

notifee.registerForegroundService(async notification => {
  if (
    notification.data &&
    'path' in notification.data &&
    typeof notification.data.path === 'string'
  ) {
    const data = notification.data as NoteProcessingNotificationData;
    const path = data.path;

    const { processNote } = await import('./src/util/note');
    await processNote(path)
      .catch(e => {
        serviceLog.error('Error processing note', e);
      })
      .finally(() => notifee.stopForegroundService());
  }
});

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
