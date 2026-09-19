import type { Model } from './entity';

export type TranscriptionModelStore = {
  id: Model['id'] | undefined;
  setId: (id: Model['id']) => void;
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
