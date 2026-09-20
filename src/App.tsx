import './global.css';

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { AudioManager } from 'react-native-audio-api';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaListener, SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Uniwind } from 'uniwind';

import Navigation from './component/navigation/Navigation';
import SQLiteProvider from './component/provider/SQLiteProvider';

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
      <SafeAreaProvider>
        <SQLiteProvider>
          <StatusBar translucent backgroundColor='transparent' />
          <SafeAreaListener onChange={({ insets }) => Uniwind.updateInsets(insets)}>
            <BottomSheetModalProvider>
              <SafeAreaView edges={['left', 'right']} style={styles.main}>
                <App />
              </SafeAreaView>
            </BottomSheetModalProvider>
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
