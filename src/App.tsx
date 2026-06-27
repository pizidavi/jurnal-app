import './global.css';

import { QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { AudioManager } from 'react-native-audio-api';
import { initExecutorch } from 'react-native-executorch';
import { ExpoResourceFetcher } from 'react-native-executorch-expo-resource-fetcher';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import notifee, { AndroidImportance } from 'react-native-notify-kit';
import { SafeAreaListener, SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Uniwind } from 'uniwind';

import Navigation from './component/navigation/Navigation';
import SQLiteProvider from './component/provider/SQLiteProvider';
import { queryClient } from './config/client';
import i18n from './locale';
import { NOTIFICATION_CHANNEL } from './type/enum';
import { appLog } from './util/logger';

initExecutorch({
  resourceFetcher: ExpoResourceFetcher,
});

AudioManager.setAudioSessionOptions({
  iosCategory: 'playAndRecord',
  iosMode: 'spokenAudio',
  iosOptions: ['allowBluetoothHFP', 'defaultToSpeaker'],
});

function App() {
  // Effect
  useEffect(() => {
    // Create the notification channel used by the note-processing foreground service
    notifee
      .createChannel({
        id: NOTIFICATION_CHANNEL.NOTE_PROCESSING,
        name: i18n.t('notification:noteProcessingChannelName'),
        description: i18n.t('notification:noteProcessingChannelDescription'),
        importance: AndroidImportance.LOW,
      })
      .catch(e => {
        appLog.error('Failed to create notification channel', e);
      });
  }, []);

  // Render
  return <Navigation />;
}

function Providers() {
  // Render
  return (
    <GestureHandlerRootView className='bg-background' style={styles.main}>
      <QueryClientProvider client={queryClient}>
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
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  main: { flex: 1 },
});

export default Providers;
