import { View } from 'react-native';
import LocaleText from '../component/common/LocaleText';
import BaseScreen from '../component/navigation/BaseScreen';
import { formateDate } from '../util/formatter';

function HomeScreen() {
  // Render
  return (
    <BaseScreen>
      <LocaleText text={formateDate(new Date())} className='text-h2' avoidTranslation />
      <View className='bg-surface size-10' />
    </BaseScreen>
  );
}

export default HomeScreen;
