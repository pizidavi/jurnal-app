import { ChevronRightIcon } from 'lucide-react-native';
import { Pressable } from 'react-native';

import type { Dictionary } from '../../locale';
import Icon from '../common/Icon';
import LocaleText from '../common/LocaleText';

type SettingRowProps = {
  label: Dictionary;
  value?: string;
  onPress?: () => void;
};

function SettingRow(props: SettingRowProps) {
  const { label, value, onPress } = props;

  // Render
  return (
    <Pressable
      className='flex-row items-center gap-base rounded bg-surface p-base'
      onPress={onPress}
      style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
    >
      <LocaleText text={label} className='flex-1 text-base font-medium' />
      {value && (
        <LocaleText text={value} avoidTranslation className='text-base text-muted-foreground' />
      )}
      <Icon icon={ChevronRightIcon} size={20} color='muted-foreground' />
    </Pressable>
  );
}

export default SettingRow;
