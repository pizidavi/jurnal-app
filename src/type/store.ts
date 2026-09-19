import type { Model } from './entity';

export type SettingsStore = {
  transcriptionModelId: Model['id'] | undefined;
  setTranscriptionModelId: (id: Model['id']) => void;
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
