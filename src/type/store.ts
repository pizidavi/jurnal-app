import type { Model } from './entity';
import type { LANGUAGE } from './enum';

export type SettingsStore = {
  transcriptionModelId: Model['id'] | undefined;
  setTranscriptionModelId: (id: Model['id']) => void;
  transcriptionLanguage: LANGUAGE;
  setTranscriptionLanguage: (language: LANGUAGE) => void;
};

export type ModelDownloadStore = {
  downloads: Partial<
    Record<
      Model['id'],
      {
        progress: number;
      }
    >
  >;
};
