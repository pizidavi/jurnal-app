import { useNavigation } from '@react-navigation/native';
import { ArrowLeftIcon, type LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';

import { clx } from '../../util/util';
import Icon from '../common/Icon';
import LocaleText, { type LocaleTextProps } from '../common/LocaleText';

type HeaderProps<T extends boolean = false> = {
  title: LocaleTextProps<T>['text'];
  avoidTranslation?: T;
  icon?: LucideIcon;
  onIconPress?: () => void;
  className?: string;
};

function Header<T extends boolean = false>(props: HeaderProps<T>) {
  const { title, avoidTranslation, icon, onIconPress, className } = props;

  // Hook
  const navigation = useNavigation();

  // Render
  return (
    <View className={clx('flex-row items-center py-sm', className)}>
      {navigation.canGoBack() && (
        <Icon
          icon={ArrowLeftIcon}
          size={24}
          color='foreground'
          className='-translate-x-sm p-sm'
          onPress={() => navigation.goBack()}
        />
      )}
      <LocaleText text={title} className='flex-1 text-h2' avoidTranslation={avoidTranslation} />
      {icon && (
        <Icon
          icon={icon}
          size={24}
          color='foreground'
          className='translate-x-sm p-sm'
          onPress={onIconPress}
        />
      )}
    </View>
  );
}

export default Header;
