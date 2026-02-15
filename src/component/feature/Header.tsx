import { useNavigation } from '@react-navigation/native';
import { ArrowLeftIcon } from 'lucide-react-native';
import { View } from 'react-native';
import Icon from '../common/Icon';
import LocaleText, { type LocaleTextProps } from '../common/LocaleText';

type HeaderProps<T extends boolean = false> = {
  title: LocaleTextProps<T>['text'];
  avoidTranslation?: T;
};

function Header<T extends boolean = false>(props: HeaderProps<T>) {
  const { title, avoidTranslation } = props;

  // Hook
  const navigation = useNavigation();

  // Render
  return (
    <View className='flex-row items-center py-sm'>
      {navigation.canGoBack() && (
        <Icon
          icon={ArrowLeftIcon}
          size={24}
          color='foreground'
          className='-translate-x-sm p-sm'
          onPress={() => navigation.goBack()}
        />
      )}
      <LocaleText text={title} className='text-h2' avoidTranslation={avoidTranslation} />
    </View>
  );
}

export default Header;
