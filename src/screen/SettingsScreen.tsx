import { useCallback, useMemo } from 'react';

import Header from '../component/feature/Header';
import ModelCard from '../component/feature/ModelCard';
import SelectSheet from '../component/modal/SelectSheet';
import BaseScreen from '../component/navigation/BaseScreen';
import { useSettingsStore } from '../store/store';
import type { Model } from '../type/entity';
import { getModelById, MODELS } from '../util/model';

function SettingsScreen() {
  // Global state
  const transcriptionModelId = useSettingsStore(state => state.transcriptionModelId);

  // Memo
  const selectedModel = useMemo(
    () => (transcriptionModelId ? getModelById(transcriptionModelId) : undefined),
    [transcriptionModelId],
  );

  // Callback
  const renderModel = useCallback(
    (model: Model, isSelected: boolean, select: () => void) => (
      <ModelCard model={model} selected={isSelected} onSelect={select} />
    ),
    [],
  );

  const handleSelect = useCallback(
    (model: Model) => useSettingsStore.getState().setTranscriptionModelId(model.id),
    [],
  );

  // Render
  return (
    <BaseScreen className='gap-base'>
      <Header title='general:settings' />
      <SelectSheet.Select
        label='settings:transcriptionModel'
        placeholder='general:notSet'
        title='settings:models'
        options={MODELS}
        selected={selectedModel}
        keyExtractor={model => model.id}
        getOptionLabel={model => model.name}
        renderItem={renderModel}
        onSelect={handleSelect}
      />
    </BaseScreen>
  );
}

export default SettingsScreen;
