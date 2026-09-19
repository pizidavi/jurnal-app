import type { LucideIcon } from 'lucide-react-native';
import { useMemo } from 'react';
import { Pressable, View } from 'react-native';
import { useCSSVariable } from 'uniwind';

type IconProps = {
  icon: LucideIcon;
  size?: number;
  color?: 'primary' | 'primary-foreground' | 'foreground' | 'muted-foreground' | 'destructive';
  className?: string;
  onPress?: () => void;
  disabled?: boolean;
};

/**
 * Icon component
 * @param props
 */
function Icon(props: IconProps) {
  const {
    icon: IconComponent,
    size = 24,
    color = 'foreground',
    className,
    onPress,
    disabled = false,
  } = props;

  // Hook
  const [
    colorPrimary,
    colorPrimaryForeground,
    colorForeground,
    colorMutedForeground,
    colorDestructive,
  ] = useCSSVariable([
    '--primary',
    '--primary-foreground',
    '--foreground',
    '--muted-foreground',
    '--destructive',
  ] satisfies `--${typeof color}`[]);

  // Memo
  const ContainerComponent = useMemo(() => (onPress ? Pressable : View), [onPress]);

  const iconColor = useMemo(() => {
    switch (color) {
      case 'primary':
        return colorPrimary?.toString() ?? '#fff';
      case 'primary-foreground':
        return colorPrimaryForeground?.toString() ?? '#000';
      case 'foreground':
        return colorForeground?.toString() ?? '#000';
      case 'muted-foreground':
        return colorMutedForeground?.toString() ?? '#888888';
      case 'destructive':
        return colorDestructive?.toString() ?? '#dc2626';
    }
    color satisfies never;
  }, [
    color,
    colorPrimary,
    colorPrimaryForeground,
    colorForeground,
    colorMutedForeground,
    colorDestructive,
  ]);

  // Render
  return (
    <ContainerComponent
      onPress={onPress}
      className={className}
      style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
      disabled={disabled}
    >
      <IconComponent size={size} color={iconColor} />
    </ContainerComponent>
  );
}

export default Icon;
