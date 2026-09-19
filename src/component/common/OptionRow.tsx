import { CircleCheckIcon } from 'lucide-react-native';
import { Pressable } from 'react-native';

import { clx } from '../../util/util';
import Icon from './Icon';
import LocaleText from './LocaleText';

type OptionRowProps = {
  label: string;
  selected?: boolean;
  onSelect?: () => void;
};

function OptionRow(props: OptionRowProps) {
  const { label, selected = false, onSelect } = props;

  // Render
  return (
    <Pressable
      className={clx(
        'flex-row items-center gap-base rounded bg-surface p-base',
        selected ? 'border border-primary' : 'border border-transparent',
      )}
      onPress={onSelect}
      disabled={selected}
      style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
    >
      <LocaleText text={label} avoidTranslation className='flex-1 text-base font-medium' />
      {selected && <Icon icon={CircleCheckIcon} size={20} color='primary' />}
    </Pressable>
  );
}

export default OptionRow;
