import { eq } from 'drizzle-orm';
import { initLlama } from 'llama.rn';
import { initWhisper } from 'whisper.rn/index';

import { db } from '../config/client';
import { notesTable } from '../database/schema';
import { useSettingsStore } from '../store/store';
import { MODEL_KIND } from '../type/enum';
import { appLog } from './logger';
import { getModelById, getModelFilename } from './model';
import { getEnhancementPrompt } from './prompt';

export const processNote = async (path: string): Promise<void> => {
  appLog.debug('Processing note', { path });

  const language = useSettingsStore.getState().transcriptionLanguage;

  const transcriptionModelId = useSettingsStore.getState().transcriptionModelId;
  if (!transcriptionModelId) throw new Error('Transcription model ID is not set');

  const transcriptionModel = getModelById(MODEL_KIND.TRANSCRIPTION, transcriptionModelId);
  if (!transcriptionModel)
    throw new Error(`Transcription model with ID ${transcriptionModelId} not found`);

  const transcriptionModelFilename = getModelFilename(transcriptionModel, MODEL_KIND.TRANSCRIPTION);

  const llmModelId = useSettingsStore.getState().llmModelId;
  if (!llmModelId) throw new Error('LLM model ID is not set');

  const llmModel = getModelById(MODEL_KIND.LLM, llmModelId);
  if (!llmModel) throw new Error(`LLM model with ID ${llmModelId} not found`);

  const llmFilename = getModelFilename(llmModel, MODEL_KIND.LLM);

  // Create the note
  const [{ id: noteId }] = await db
    .insert(notesTable)
    .values({
      audioPath: path,
    })
    .returning({ id: notesTable.id });

  // Transcription
  const transcriptionContext = await initWhisper({
    filePath: transcriptionModelFilename.uri,
  });

  appLog.debug('Transcribing audio', { id: noteId, path });
  const { promise } = transcriptionContext.transcribe(path, {
    language,
    temperature: 0.6,
  });
  const { result: transcription, segments } = await promise;
  appLog.debug('Transcription completed', { id: noteId });

  await transcriptionContext.release().catch(error => {
    appLog.warn('Error releasing Whisper context', { id: noteId, error });
  });

  // Save note transcription
  await db
    .update(notesTable)
    .set({
      content: transcription, // Save the transcription as the initial content
      segments: JSON.stringify(segments),
    })
    .where(eq(notesTable.id, noteId));

  // Enhancement
  const llmContext = await initLlama({
    model: llmFilename.uri,
    n_ctx: 4096,
  });

  appLog.debug('Enhancing transcription', { id: noteId });
  const { content, text } = await llmContext.completion({
    messages: [
      { role: 'system', content: getEnhancementPrompt(language) },
      { role: 'user', content: transcription },
    ],
    temperature: 0.6,
  });
  appLog.debug('Enhancement completed', { id: noteId });
  llmContext.release().catch(error => {
    appLog.warn('Error releasing LLM context', { id: noteId, error });
  });

  const enchanced = (content || text).trim();

  // Save note enhancement
  await db
    .update(notesTable)
    .set({
      content: enchanced,
    })
    .where(eq(notesTable.id, noteId));

  appLog.info('Note process completed', { id: noteId, path, transcription, enchanced });
};
