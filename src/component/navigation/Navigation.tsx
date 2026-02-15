import { NavigationContainer } from '@react-navigation/native';
import HomeView from '../../view/HomeView';
import NoteModal from '../modal/NoteModal';

function Navigation() {
  // Render
  return (
    <>
      <NavigationContainer>
        <HomeView />
      </NavigationContainer>
      <NoteModal />
    </>
  );
}

export default Navigation;
