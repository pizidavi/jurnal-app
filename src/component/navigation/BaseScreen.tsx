import { type ReactNode, useMemo } from 'react';
import { ScrollView, type ScrollViewProps, View, type ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { clx } from '../../util/util';

type BaseScreenProps<T extends 'view' | 'scroll'> = {
  children: ReactNode;
} & (T extends 'view'
  ? {
      as: 'view';
    } & ViewProps
  : {
      as?: 'scroll';
    } & ScrollViewProps);

/**
 * Base screen
 * @param props
 */
function BaseScreen<T extends 'view' | 'scroll'>(props: BaseScreenProps<T>) {
  const { children, as, className, ...rest } = props;

  // Hooks
  const inset = useSafeAreaInsets();

  // Memos
  const mainStyle = useMemo(
    () => ({
      paddingTop: inset.top,
      paddingBottom: inset.bottom,
      paddingLeft: inset.left,
      paddingRight: inset.right,
    }),
    [inset],
  );

  // Render
  return (
    <View className='flex-1 bg-background' style={mainStyle}>
      {as === 'view' ? (
        <View className={clx('flex-1 p-base', className)} {...rest}>
          {children}
        </View>
      ) : (
        <ScrollView
          bounces={false}
          automaticallyAdjustKeyboardInsets={true}
          contentContainerClassName={clx('grow p-base', className)}
          {...rest}
        >
          {children}
        </ScrollView>
      )}
    </View>
  );
}

export default BaseScreen;
