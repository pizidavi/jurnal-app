import { FlatList } from 'react-native';

import Header from '../component/feature/Header';
import ModelCard from '../component/feature/ModelCard';
import BaseScreen from '../component/navigation/BaseScreen';
import { MODELS } from '../util/model';

function TranscriptionModelsScreen() {
  // Render
  return (
    <BaseScreen as='view' className='gap-base px-0 pb-0'>
      <Header title='settings:models' className='px-base' />
      <FlatList
        data={MODELS}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <ModelCard model={item} />}
        contentContainerClassName='gap-base grow px-base pb-20'
      />
    </BaseScreen>
  );
}

export default TranscriptionModelsScreen;
