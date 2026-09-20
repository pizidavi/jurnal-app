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
import { MODEL_KIND } from '../type/enum';
import { appLog } from '../util/logger';
import { getModelById, getModels } from '../util/model';

function SettingsScreen() {
  // Global state
  const transcriptionModelId = useSettingsStore(state => state.transcriptionModelId);
  const llmModelId = useSettingsStore(state => state.llmModelId);
  const transcriptionLanguage = useSettingsStore(state => state.transcriptionLanguage);

  // Memo
  const selectedTranscriptionModel = useMemo(
    () =>
      transcriptionModelId
        ? getModelById(MODEL_KIND.TRANSCRIPTION, transcriptionModelId)
        : undefined,
    [transcriptionModelId],
  );

  const selectedLlmModel = useMemo(
    () => (llmModelId ? getModelById(MODEL_KIND.LLM, llmModelId) : undefined),
    [llmModelId],
  );

  // Callback
  const renderTranscriptionModel = useCallback(
    (model: Model, isSelected: boolean, select: () => void) => (
      <ModelCard
        model={model}
        kind={MODEL_KIND.TRANSCRIPTION}
        selected={isSelected}
        onSelect={select}
      />
    ),
    [],
  );

  const renderLlmModel = useCallback(
    (model: Model, isSelected: boolean, select: () => void) => (
      <ModelCard model={model} kind={MODEL_KIND.LLM} selected={isSelected} onSelect={select} />
    ),
    [],
  );

  const handleTranscriptionModelSelect = useCallback((model: Model) => {
    appLog.debug('Selected transcription model', { modelId: model.id });
    useSettingsStore.getState().setTranscriptionModelId(model.id);
  }, []);

  const handleLlmModelSelect = useCallback((model: Model) => {
    appLog.debug('Selected enhancement model', { modelId: model.id });
    useSettingsStore.getState().setLlmModelId(model.id);
  }, []);

  const handleLanguageSelect = useCallback((language: LANGUAGE) => {
    appLog.debug('Selected transcription language', { language });
    useSettingsStore.getState().setTranscriptionLanguage(language);
  }, []);

  // Render
  return (
    <BaseScreen className='gap-base'>
      <Header title='general:settings' />
      <SelectSheet
        label='settings:transcriptionModel'
        placeholder='general:notSet'
        title='settings:models'
        options={getModels(MODEL_KIND.TRANSCRIPTION)}
        selected={selectedTranscriptionModel}
        keyExtractor={model => model.id}
        getOptionLabel={model => model.name}
        renderItem={renderTranscriptionModel}
        onSelect={handleTranscriptionModelSelect}
      />
      <SelectSheet
        label='settings:enhancementModel'
        placeholder='general:notSet'
        title='settings:models'
        options={getModels(MODEL_KIND.LLM)}
        selected={selectedLlmModel}
        keyExtractor={model => model.id}
        getOptionLabel={model => model.name}
        renderItem={renderLlmModel}
        onSelect={handleLlmModelSelect}
      />
      <SelectSheet
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
