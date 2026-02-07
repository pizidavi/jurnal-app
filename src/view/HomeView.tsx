import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screen/HomeScreen';
import type { HomeStackParamList } from '../type/navigation';

const Stack = createNativeStackNavigator<HomeStackParamList>();

function HomeView() {
  // Render
  return (
    <Stack.Navigator
      initialRouteName='Home'
      screenOptions={{
        headerShown: false,
        freezeOnBlur: true,
      }}
    >
      <Stack.Screen name='Home' component={HomeScreen} />
    </Stack.Navigator>
  );
}

export default HomeView;
