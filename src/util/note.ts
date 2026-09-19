import { initWhisper } from 'whisper.rn/index';

import { db } from '../config/client';
import { notesTable } from '../database/schema';
import { useSettingsStore } from '../store/store';
import { appLog } from './logger';
import { getModelById, getModelFilename } from './model';

export const processNote = async (path: string): Promise<void> => {
  appLog.debug('Processing note', { path });

  const transcriptionLanguage = useSettingsStore.getState().transcriptionLanguage;
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
    language: transcriptionLanguage,
  });
  const { result, language } = await promise;
  appLog.debug('Transcription completed', { path, language });

  await context.release().catch(error => {
    appLog.warn('Error releasing Whisper context', { error });
  });

  const [{ id }] = await db
    .insert(notesTable)
    .values({
      content: result,
    })
    .returning({ id: notesTable.id });

  appLog.info('Note saved to database', { path, id });
};
