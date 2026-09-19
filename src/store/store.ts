import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { ModelDownloadStore, TranscriptionModelStore } from '../type/store';
import { localStorage } from './local';

export const useTranscriptionModelStore = create(
  persist<TranscriptionModelStore>(
    set => ({
      id: undefined,
      setId: id => set({ id }),
    }),
    {
      name: 'transcription-model-store',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export const useModelDownloadStore = create<ModelDownloadStore>(() => ({
  downloads: {},
}));
