import { MicIcon } from 'lucide-react-native';
import { useCallback } from 'react';
import { Pressable } from 'react-native';

import { eventEmitter } from '../../config/client';
import { useSettingsStore } from '../../store/store';
import { appLog } from '../../util/logger';
import Icon from '../common/Icon';

function RecordButton() {
  // Global state
  const transcriptionModelId = useSettingsStore(state => state.transcriptionModelId);

  // Callback
  const handlePress = useCallback(() => {
    if (!transcriptionModelId) {
      appLog.warn('No transcription model selected, cannot start recording');
      // TODO: show a toast to the user that no model is selected
      return;
    }

    Promise.resolve()
      .then(() => {
        // Open the note modal
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
