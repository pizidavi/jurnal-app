import './global.css';

import { QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { AudioManager } from 'react-native-audio-api';
import { initExecutorch } from 'react-native-executorch';
import { ExpoResourceFetcher } from 'react-native-executorch-expo-resource-fetcher';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaListener, SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Uniwind } from 'uniwind';

import Navigation from './component/navigation/Navigation';
import SQLiteProvider from './component/provider/SQLiteProvider';
import { queryClient } from './config/client';

initExecutorch({
  resourceFetcher: ExpoResourceFetcher,
});

AudioManager.setAudioSessionOptions({
  iosCategory: 'playAndRecord',
  iosMode: 'spokenAudio',
  iosOptions: ['allowBluetoothHFP', 'defaultToSpeaker'],
});

function App() {
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
