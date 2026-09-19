import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screen/HomeScreen';
import NoteScreen from '../screen/NoteScreen';
import SettingsScreen from '../screen/SettingsScreen';
import TranscriptionModelsScreen from '../screen/TranscriptionModelsScreen';
import type { HomeStackParamList } from '../type/navigation';

const Stack = createNativeStackNavigator<HomeStackParamList>();

function HomeView() {
  // Render
  return (
    <Stack.Navigator
      initialRouteName='Home'
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name='Home' component={HomeScreen} />
      <Stack.Screen name='Note' component={NoteScreen} />
      <Stack.Screen name='Settings' component={SettingsScreen} />
      <Stack.Screen name='TranscriptionModels' component={TranscriptionModelsScreen} />
    </Stack.Navigator>
  );
}

export default HomeView;
