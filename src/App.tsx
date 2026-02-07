import './global.css';
import { QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaListener, SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Uniwind } from 'uniwind';
import Navigation from './component/navigation/Navigation';
import { queryClient } from './config/client';

function App() {
  // Render
  return <Navigation />;
}

function Providers() {
  // Render
  return (
    <GestureHandlerRootView style={styles.main}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <StatusBar translucent backgroundColor='transparent' />
          <SafeAreaListener onChange={({ insets }) => Uniwind.updateInsets(insets)}>
            <SafeAreaView edges={['left', 'right']} style={styles.main}>
              <App />
            </SafeAreaView>
          </SafeAreaListener>
        </SafeAreaProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  main: { flex: 1 },
});

export default Providers;
