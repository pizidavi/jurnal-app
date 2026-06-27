import { eq } from 'drizzle-orm';
import type { SpeechToTextLanguage } from 'react-native-executorch';

import { aiService, db, llmService } from '../config/client';
import { notesTable } from '../database/schema';
import i18n from '../locale';
import { appLog } from './logger';

export const processNote = async (path: string): Promise<void> => {
  const [note] = await db.insert(notesTable).values({ content: '' }).returning();
  appLog.info('Note created', { noteId: note.id });

  const transcription = await aiService
    .transcribeAudio(path, i18n.language as SpeechToTextLanguage)
    .catch(async e => {
      appLog.error('Failed to transcribe audio', e);
      await db.delete(notesTable).where(eq(notesTable.id, note.id));
      throw e;
    });
  await db.update(notesTable).set({ content: transcription }).where(eq(notesTable.id, note.id));
  appLog.info('Note transcribed', { noteId: note.id });

  const enrichedContent = await llmService.enrichTranscription(transcription);
  await db.update(notesTable).set({ content: enrichedContent }).where(eq(notesTable.id, note.id));
  appLog.info('Note enriched', { noteId: note.id });
};
