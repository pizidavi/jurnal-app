import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { useCallback, useRef } from 'react';

import type { AppRoute } from '../../type/navigation';
import { appLog } from '../../util/logger';
import HomeView from '../../view/HomeView';
import AddNoteModal from '../modal/AddNoteModal';

function Navigation() {
  // Hooks
  const navigationContainerRef = useNavigationContainerRef<AppRoute>();

  // References
  const routeNameRef = useRef<string>(undefined);

  // Callbacks
  const handleReady = useCallback(() => {
    routeNameRef.current = navigationContainerRef.getCurrentRoute()?.name;
  }, []);

  const handleStateChange = useCallback(() => {
    const previousRouteName = routeNameRef.current;
    const currentRoute = navigationContainerRef.getCurrentRoute();

    if (previousRouteName === currentRoute?.name) return;
    routeNameRef.current = currentRoute?.name;

    appLog.info(
      `Navigate to ${currentRoute?.name ?? 'Unknown'} ${JSON.stringify(currentRoute?.params) || ''}`,
    );
  }, []);

  // Render
  return (
    <>
      <NavigationContainer
        ref={navigationContainerRef}
        onReady={handleReady}
        onStateChange={handleStateChange}
      >
        <HomeView />
      </NavigationContainer>
      <AddNoteModal />
    </>
  );
}

export default Navigation;
