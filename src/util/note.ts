import { initWhisper } from 'whisper.rn/index';

import { db } from '../config/client';
import { notesTable } from '../database/schema';
import i18n from '../locale';
import { useSettingsStore } from '../store/store';
import { appLog } from './logger';
import { getModelById, getModelFilename } from './model';

export const processNote = async (path: string): Promise<void> => {
  appLog.debug('Processing note', { path });

  const transcriptionModelId = useSettingsStore.getState().transcriptionModelId;
  if (!transcriptionModelId) {
    throw new Error('Transcription model ID is not set in the store');
  }

  const transcriptionModel = getModelById(transcriptionModelId);
  if (!transcriptionModel) {
    throw new Error(`Transcription model with ID ${transcriptionModelId} not found`);
  }

  const transcriptionModelFilename = getModelFilename(transcriptionModel);

  const context = await initWhisper({
    filePath: transcriptionModelFilename.uri,
  });

  const { promise } = context.transcribe(path, {
    language: i18n.language,
  });
  const { result, segments, language } = await promise;
  appLog.info('note.ts (12) # result', result);
  appLog.info('note.ts (12) # segments', segments);
  appLog.info('note.ts (12) # language', language);

  await context.release();

  await db.insert(notesTable).values({
    content: result,
  });
};
