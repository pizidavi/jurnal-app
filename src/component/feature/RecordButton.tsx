import { MicIcon } from 'lucide-react-native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import * as Permissions from 'react-native-permissions';

import { aiService, eventEmitter } from '../../config/client';
import { appLog } from '../../util/logger';
import Icon from '../common/Icon';

function RecordButton() {
  // State
  const [status, setStatus] = useState({ ready: false, downloadProgress: 0 });

  // Memo
  const downloadProgress = useMemo(
    () => `${-(100 - status.downloadProgress)}%` as const,
    [status.downloadProgress],
  );

  // Callback
  const handlePress = useCallback(() => {
    if (!status.ready) return;

    Promise.resolve()
      .then(async () => {
        // Check microphone permission
        let microphoneStatus = await Permissions.check(
          Permissions.PERMISSIONS.ANDROID.RECORD_AUDIO,
        );
        if (microphoneStatus === Permissions.RESULTS.BLOCKED)
          throw new Error('Microphone permission is blocked');

        if (
          microphoneStatus !== Permissions.RESULTS.GRANTED &&
          microphoneStatus !== Permissions.RESULTS.UNAVAILABLE
        )
          microphoneStatus = await Permissions.request(
            Permissions.PERMISSIONS.ANDROID.RECORD_AUDIO,
          );

        if (
          microphoneStatus !== Permissions.RESULTS.GRANTED &&
          microphoneStatus !== Permissions.RESULTS.UNAVAILABLE
        )
          throw new Error('Microphone permission is blocked');

        // Check notification permission
        let notificationStatus = await Permissions.checkNotifications();
        if (notificationStatus.status === Permissions.RESULTS.BLOCKED)
          throw new Error('Notification permission is blocked');

        if (
          notificationStatus.status !== Permissions.RESULTS.GRANTED &&
          notificationStatus.status !== Permissions.RESULTS.UNAVAILABLE
        )
          notificationStatus = await Permissions.requestNotifications();

        if (
          notificationStatus.status !== Permissions.RESULTS.GRANTED &&
          notificationStatus.status !== Permissions.RESULTS.UNAVAILABLE
        )
          throw new Error('Notification permission is blocked');

        // Open the note modal
        eventEmitter.emit('note-modal:show');
      })
      .catch(e => {
        appLog.error('Failed to request permissions', e);
      });
  }, [status.ready]);

  // Effect
  useEffect(() => {
    aiService
      .loadTranscriptionModel(progress => {
        const progressPercentage = Math.round(progress * 100);
        setStatus(prev => ({
          ...prev,
          ready: progress === 1,
          downloadProgress: progressPercentage,
        }));
      })
      .catch(e => {
        appLog.error('Failed to load transcription model', e);
        setStatus(prev => ({ ...prev, ready: false }));
      });
  }, []);

  useEffect(
    () => appLog.debug(`Model download progress: ${status.downloadProgress}%`),
    [status.downloadProgress],
  );

  // Render
  return (
    <Pressable onPress={handlePress} disabled={!status.ready}>
      <View className='relative overflow-hidden rounded-full bg-foreground px-xl py-base'>
        <View
          className='absolute inset-0 bg-primary'
          style={{ transform: `translateX(${downloadProgress})` }}
        />
        <Icon icon={MicIcon} size={24} color='primary-foreground' />
      </View>
    </Pressable>
  );
}

export default RecordButton;
