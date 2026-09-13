import Header from '../component/feature/Header';
import BaseScreen from '../component/navigation/BaseScreen';

function SettingsScreen() {
  // Render
  return (
    <BaseScreen className='gap-base'>
      <Header title='general:settings' />
    </BaseScreen>
  );
}

export default SettingsScreen;
