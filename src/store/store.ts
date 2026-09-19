import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import i18n from '../locale';
import type { LANGUAGE } from '../type/enum';
import type { ModelDownloadStore, SettingsStore } from '../type/store';
import { localStorage } from './local';

export const useSettingsStore = create(
  persist<SettingsStore>(
    set => ({
      transcriptionModelId: undefined,
      setTranscriptionModelId: id => set({ transcriptionModelId: id }),
      transcriptionLanguage: i18n.language as LANGUAGE,
      setTranscriptionLanguage: language => set({ transcriptionLanguage: language }),
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
