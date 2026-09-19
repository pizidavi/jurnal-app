import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { ModelDownloadStore, SettingsStore } from '../type/store';
import { localStorage } from './local';

export const useSettingsStore = create(
  persist<SettingsStore>(
    set => ({
      transcriptionModelId: undefined,
      setTranscriptionModelId: id => set({ transcriptionModelId: id }),
    }),
    {
      name: 'settings-store',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export const useModelDownloadStore = create<ModelDownloadStore>(() => ({
  downloads: {},
}));
