import { CircleStopIcon } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import { Modal, Platform, View } from 'react-native';
import notifee, { AndroidForegroundServiceType } from 'react-native-notify-kit';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { audioService, eventEmitter } from '../../config/client';
import i18n from '../../locale';
import { NOTIFICATION_CHANNEL } from '../../type/enum';
import type { NoteProcessingNotificationData } from '../../type/struct';
import { appLog } from '../../util/logger';
import ActivityIndicator from '../common/ActivityIndicator';
import Icon from '../common/Icon';
import LocaleText from '../common/LocaleText';

function AddNoteModal() {
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
      .then(result => {
        appLog.debug('Recording stopped, file saved', result);

        if (result.duration < 2) {
          appLog.warn('Recording too short, ignoring');
          // TODO: Show toast "Recording too short"
          return;
        }

        // Start the foreground service to handle transcription
        return notifee.displayNotification({
          id: NOTIFICATION_CHANNEL.NOTE_PROCESSING,
          title: i18n.t('notification:noteProcessingTitle'),
          body: i18n.t('notification:noteProcessingBody'),
          data: {
            path: result.paths[0],
          } satisfies NoteProcessingNotificationData,
          android: {
            channelId: NOTIFICATION_CHANNEL.NOTE_PROCESSING,
            asForegroundService: true,
            foregroundServiceTypes: [
              AndroidForegroundServiceType.FOREGROUND_SERVICE_TYPE_DATA_SYNC,
            ],
            ongoing: true,
            progress: {
              indeterminate: true,
            },
          },
        });
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
      animationType={Platform.OS === 'ios' ? 'slide' : 'fade'}
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

export default AddNoteModal;
