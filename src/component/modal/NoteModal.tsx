import { eq } from 'drizzle-orm';
import { CircleStopIcon } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import { Modal, View } from 'react-native';
import type { SpeechToTextLanguage } from 'react-native-executorch';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { aiService, audioService, db, eventEmitter, llmService } from '../../config/client';
import { notesTable } from '../../database/schema';
import i18n from '../../locale';
import { appLog } from '../../util/logger';
import ActivityIndicator from '../common/ActivityIndicator';
import Icon from '../common/Icon';
import LocaleText from '../common/LocaleText';

const createNote = async (path: string) => {
  // Create note
  const [note] = await db.insert(notesTable).values({ content: '' }).returning();
  appLog.debug('Note created', { noteId: note.id });

  // Transcribe audio
  const transcription = await aiService
    .transcribeAudio(path, i18n.language as SpeechToTextLanguage)
    .catch(async e => {
      appLog.error('Failed to transcribe audio', e);
      await db.delete(notesTable).where(eq(notesTable.id, note.id)); // Clean up the empty note
      throw e; // Rethrow to be caught by caller and show error toast
    });
  await db.update(notesTable).set({ content: transcription }).where(eq(notesTable.id, note.id));
  appLog.debug('Note transcribed', { noteId: note.id });

  // Enrich note
  const enrichedContent = await llmService.enrichTranscription(transcription);
  await db.update(notesTable).set({ content: enrichedContent }).where(eq(notesTable.id, note.id));
  appLog.debug('Note enriched', { noteId: note.id });
};

function NoteModal() {
  // Hook
  const { top, bottom } = useSafeAreaInsets();

  // State
  const [isVisible, setIsVisible] = useState(false);

  // Callback
  const startRecording = useCallback(() => {
    audioService
      .startRecording()
      .then(() => appLog.debug('Recording started'))
      .catch((e: unknown) => {
        appLog.error('Failed to start recording', e);
        // TODO: Show error toast
      });
  }, []);

  const stopRecording = useCallback(() => {
    audioService
      .stopRecording()
      .then(async result => {
        appLog.debug('Recording stopped, file saved', result);

        if (result.duration < 2) {
          appLog.warn('Recording too short, ignoring');
          // TODO: Show toast "Recording too short"
          return;
        }

        await createNote(result.path);
      })
      .catch((e: unknown) => {
        appLog.error('Failed to stop recording', e);
        // TODO: Show error toast
      });
  }, []);

  const openModal = useCallback(() => {
    setIsVisible(true);
    startRecording();
  }, []);

  const closeModal = useCallback(() => {
    stopRecording();
    setIsVisible(false);
  }, []);

  // Effect
  useEffect(() => {
    eventEmitter.addListener('note-modal:show', openModal);
    return () => {
      eventEmitter.removeListener('note-modal:show', openModal);
    };
  }, [openModal]);

  // Render
  return (
    <Modal
      visible={isVisible}
      onRequestClose={closeModal}
      allowSwipeDismissal
      animationType='fade'
      transparent
    >
      <View
        className='flex-1 bg-background/95 p-base'
        style={{ paddingTop: top, paddingBottom: bottom }}
      >
        <View className='flex-1 items-center justify-center gap-base px-base'>
          <LocaleText text='general:recording' className='text-center text-h2' />
          <ActivityIndicator color='primary' size='large' />
        </View>
      </View>
      <View className='absolute right-0 bottom-10 left-0 flex items-center justify-center'>
        <Icon
          icon={CircleStopIcon}
          size={24}
          color='primary-foreground'
          className='relative rounded-full bg-primary px-xl py-base'
          onPress={closeModal}
        />
      </View>
    </Modal>
  );
}

export default NoteModal;
