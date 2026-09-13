import { MicIcon } from 'lucide-react-native';
import { useCallback } from 'react';
import { Pressable } from 'react-native';

import { eventEmitter } from '../../config/client';
import { appLog } from '../../util/logger';
import Icon from '../common/Icon';

function RecordButton() {
  // Callback
  const handlePress = useCallback(() => {
    Promise.resolve()
      .then(() => {
        // Open the note modal
        eventEmitter.emit('note-modal:show');
      })
      .catch(e => {
        appLog.error('Failed to request permissions', e);
      });
  }, []);

  // Render
  return (
    <Pressable className='rounded-full bg-primary px-xl py-base' onPress={handlePress}>
      <Icon icon={MicIcon} size={24} color='primary-foreground' />
    </Pressable>
  );
}

export default RecordButton;
