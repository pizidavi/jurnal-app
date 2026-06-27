import { NavigationContainer } from '@react-navigation/native';

import HomeView from '../../view/HomeView';
import AddNoteModal from '../modal/AddNoteModal';

function Navigation() {
  // Render
  return (
    <>
      <NavigationContainer>
        <HomeView />
      </NavigationContainer>
      <AddNoteModal />
    </>
  );
}

export default Navigation;
