import { useMemo } from 'react';

import Header from '../component/feature/Header';
import SettingRow from '../component/feature/SettingRow';
import BaseScreen from '../component/navigation/BaseScreen';
import { useSettingsStore } from '../store/store';
import type { SettingsScreenProps } from '../type/navigation';
import { getModelById } from '../util/model';

function SettingsScreen({ navigation }: SettingsScreenProps) {
  // Global state
  const selectedModelId = useSettingsStore(state => state.transcriptionModelId);

  // Memo
  const selectedModelName = useMemo(
    () => (selectedModelId ? (getModelById(selectedModelId)?.name ?? '-') : '-'),
    [selectedModelId],
  );

  // Render
  return (
    <BaseScreen className='gap-base'>
      <Header title='general:settings' />
      <SettingRow
        label='settings:transcriptionModel'
        value={selectedModelName}
        onPress={() => navigation.navigate('TranscriptionModels')}
      />
    </BaseScreen>
  );
}

export default SettingsScreen;
