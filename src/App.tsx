import './global.css';

import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { AudioManager } from 'react-native-audio-api';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import notifee, { AndroidImportance } from 'react-native-notify-kit';
import Permissions from 'react-native-permissions';
import { SafeAreaListener, SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Uniwind } from 'uniwind';

import Navigation from './component/navigation/Navigation';
import SQLiteProvider from './component/provider/SQLiteProvider';
import i18n from './locale';
import { NOTIFICATION_CHANNEL } from './type/enum';
import { appLog } from './util/logger';

AudioManager.setAudioSessionOptions({
  iosCategory: 'playAndRecord',
  iosMode: 'spokenAudio',
  iosOptions: ['allowBluetoothHFP', 'defaultToSpeaker'],
});

function App() {
  // Callback
  const getPermissions = useCallback(async () => {
    let microphoneStatus = await Permissions.check(Permissions.PERMISSIONS.ANDROID.RECORD_AUDIO);
    if (microphoneStatus === Permissions.RESULTS.BLOCKED)
      throw new Error('Microphone permission is blocked');

    if (
      microphoneStatus !== Permissions.RESULTS.GRANTED &&
      microphoneStatus !== Permissions.RESULTS.UNAVAILABLE
    )
      microphoneStatus = await Permissions.request(Permissions.PERMISSIONS.ANDROID.RECORD_AUDIO);

    if (
      microphoneStatus !== Permissions.RESULTS.GRANTED &&
      microphoneStatus !== Permissions.RESULTS.UNAVAILABLE
    )
      throw new Error('Microphone permission is blocked');

    // Check notification permission
    let notificationStatus = await Permissions.checkNotifications();
    if (notificationStatus.status === Permissions.RESULTS.BLOCKED)
      throw new Error('Notification permission is blocked');

    if (
      notificationStatus.status !== Permissions.RESULTS.GRANTED &&
      notificationStatus.status !== Permissions.RESULTS.UNAVAILABLE
    )
      notificationStatus = await Permissions.requestNotifications();

    if (
      notificationStatus.status !== Permissions.RESULTS.GRANTED &&
      notificationStatus.status !== Permissions.RESULTS.UNAVAILABLE
    )
      throw new Error('Notification permission is blocked');

    // Create the notification channel used by the note-processing foreground service
    notifee
      .createChannel({
        id: NOTIFICATION_CHANNEL.NOTE_PROCESSING,
        name: i18n.t('notification:noteProcessingChannelName'),
        description: i18n.t('notification:noteProcessingChannelDescription'),
        importance: AndroidImportance.DEFAULT,
      })
      .catch(e => {
        appLog.error('Failed to create notification channel', e);
      });
  }, []);

  // Effect
  useEffect(() => {
    getPermissions().catch(e => {
      appLog.error('Failed to get permissions', e);
    });
  }, []);

  // Render
  return <Navigation />;
}

function Providers() {
  // Render
  return (
    <GestureHandlerRootView className='bg-background' style={styles.main}>
      <SafeAreaProvider>
        <SQLiteProvider>
          <StatusBar translucent backgroundColor='transparent' />
          <SafeAreaListener onChange={({ insets }) => Uniwind.updateInsets(insets)}>
            <SafeAreaView edges={['left', 'right']} style={styles.main}>
              <App />
            </SafeAreaView>
          </SafeAreaListener>
        </SQLiteProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  main: { flex: 1 },
});

export default Providers;
