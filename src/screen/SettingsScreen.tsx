import { useCallback, useMemo } from 'react';

import OptionRow from '../component/common/OptionRow';
import Header from '../component/feature/Header';
import ModelCard from '../component/feature/ModelCard';
import SelectSheet from '../component/modal/SelectSheet';
import BaseScreen from '../component/navigation/BaseScreen';
import { getLanguageName, LANGUAGES } from '../locale';
import { useSettingsStore } from '../store/store';
import type { Model } from '../type/entity';
import type { LANGUAGE } from '../type/enum';
import { appLog } from '../util/logger';
import { getModelById, MODELS } from '../util/model';

function SettingsScreen() {
  // Global state
  const transcriptionModelId = useSettingsStore(state => state.transcriptionModelId);
  const transcriptionLanguage = useSettingsStore(state => state.transcriptionLanguage);

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

  const handleSelect = useCallback((model: Model) => {
    appLog.debug('Selected transcription model', { modelId: model.id });
    useSettingsStore.getState().setTranscriptionModelId(model.id);
  }, []);

  const handleLanguageSelect = useCallback((language: LANGUAGE) => {
    appLog.debug('Selected transcription language', { language });
    useSettingsStore.getState().setTranscriptionLanguage(language);
  }, []);

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
      <SelectSheet.Select
        label='settings:transcriptionLanguage'
        placeholder='general:notSet'
        title='settings:language'
        options={LANGUAGES}
        selected={transcriptionLanguage}
        keyExtractor={language => language}
        getOptionLabel={getLanguageName}
        renderItem={(language, isSelected, select) => (
          <OptionRow label={getLanguageName(language)} selected={isSelected} onSelect={select} />
        )}
        onSelect={handleLanguageSelect}
      />
    </BaseScreen>
  );
}

export default SettingsScreen;
