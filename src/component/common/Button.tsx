import type { LucideIcon } from 'lucide-react-native';
import { useMemo } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { useCSSVariable } from 'uniwind';
import type { Dictionary } from '../../locale';
import { clx } from '../../util/util';
import LocaleText from './LocaleText';

type ButtonProps = {
  /** Text */
  text: Dictionary;
  /** Type */
  theme?: 'primary' | 'outline';
  /** On press callback */
  onPress?: () => void;
  /** Loading */
  loading?: boolean;
  /** Disabled */
  disabled?: boolean;
  /** Icon */
  icon?: LucideIcon;
  className?: string;
};

/**
 * Button component
 * @param props
 */
function Button(props: ButtonProps) {
  const { text, theme = 'primary', className, loading, disabled, icon: Icon, onPress } = props;

  // Hook
  const [colorPrimary, colorPrimaryForeground] = useCSSVariable([
    '--primary',
    '--primary-foreground',
  ]);

  // Memo
  const mainClassName = useMemo(() => {
    const base = clx(
      'min-h-11 flex-row items-center justify-between gap-sm rounded px-4',
      disabled ? 'opacity-80' : '',
    );
    switch (theme) {
      case 'primary':
        return clx(base, 'border border-primary bg-primary', className);
      case 'outline':
        return clx(base, 'border border-primary bg-background', className);
    }
    theme satisfies never;
  }, [theme, className, disabled]);

  const textClassName = useMemo(() => {
    const base = 'text-center font-semibold';
    switch (theme) {
      case 'primary':
        return clx(base, 'text-primary-foreground');
      case 'outline':
        return clx(base, 'text-primary');
    }
    theme satisfies never;
  }, [theme]);

  const iconColor = useMemo(() => {
    switch (theme) {
      case 'primary':
        return colorPrimaryForeground?.toString() ?? '#fff';
      case 'outline':
        return colorPrimary?.toString() ?? '#000';
    }
    theme satisfies never;
  }, [theme, colorPrimary, colorPrimaryForeground]);

  // Render
  return (
    <Pressable
      onPress={onPress}
      className={mainClassName}
      hitSlop={5}
      style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
      disabled={!!loading || !!disabled}
    >
      <View className='w-6 justify-center'>{Icon && <Icon size={25} color={iconColor} />}</View>
      <LocaleText text={text} className={textClassName} />
      <View className='w-6 justify-center'>
        {loading && <ActivityIndicator size={25} color={iconColor} />}
      </View>
    </Pressable>
  );
}

export default Button;
