import { Text } from 'react-native';
import BaseScreen from '../component/navigation/BaseScreen';

function HomeScreen() {
  // Render
  return (
    <BaseScreen as='scroll'>
      <Text>Home</Text>
    </BaseScreen>
  );
}

export default HomeScreen;
