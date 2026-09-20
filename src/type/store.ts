import type { Model } from './entity';
import type { LANGUAGE, MODEL_KIND } from './enum';

export type ModelDownloadKey = `${MODEL_KIND}:${Model['id']}`;

export type SettingsStore = {
  transcriptionModelId: Model['id'] | undefined;
  setTranscriptionModelId: (id: Model['id']) => void;
  llmModelId: Model['id'] | undefined;
  setLlmModelId: (id: Model['id']) => void;
  transcriptionLanguage: LANGUAGE;
  setTranscriptionLanguage: (language: LANGUAGE) => void;
};

export type ModelDownloadStore = {
  downloads: Partial<Record<ModelDownloadKey, { progress: number }>>;
};
