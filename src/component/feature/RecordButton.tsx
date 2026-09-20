import { useNavigation } from '@react-navigation/native';
import { MicIcon } from 'lucide-react-native';
import { useCallback } from 'react';
import { Pressable } from 'react-native';

import { eventEmitter } from '../../config/client';
import { useSettingsStore } from '../../store/store';
import type { AppNavigationProp } from '../../type/navigation';
import { showAlert } from '../../util/alert';
import { appLog } from '../../util/logger';
import { requestRecordingPermissions } from '../../util/permission';
import Icon from '../common/Icon';

function RecordButton() {
  // Hook
  const navigation = useNavigation<AppNavigationProp>();

  // Global state
  const transcriptionModelId = useSettingsStore(state => state.transcriptionModelId);

  // Callback
  const handlePress = useCallback(() => {
    requestRecordingPermissions()
      .then(granted => {
        if (!granted) {
          appLog.warn('No permission granted, cannot start recording');
          return;
        }

        if (!transcriptionModelId) {
          appLog.warn('No transcription model selected, cannot start recording');
          showAlert('general:error', 'recording:noTranscriptionModel', [
            { text: 'general:cancel', style: 'cancel' },
            {
              text: 'general:openSettings',
              onPress: () => {
                navigation.navigate('Settings');
              },
            },
          ]);
          return;
        }

        eventEmitter.emit('note-modal:show');
      })
      .catch(e => {
        appLog.error('Failed to request permissions', e);
      });
  }, [transcriptionModelId]);

  // Render
  return (
    <Pressable
      className={`rounded-full ${transcriptionModelId ? 'bg-primary' : 'bg-muted-foreground'} px-xl py-base`}
      onPress={handlePress}
    >
      <Icon icon={MicIcon} size={24} color='primary-foreground' />
    </Pressable>
  );
}

export default RecordButton;
