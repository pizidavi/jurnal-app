import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetModal,
  type BottomSheetModalProps,
} from '@gorhom/bottom-sheet';
import type { ForwardedRef, ReactNode } from 'react';
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCSSVariable } from 'uniwind';

export type BottomSheetRef = {
  /** Present the sheet */
  present: () => void;
  /** Whether the sheet is currently presented */
  presented: () => boolean;
  /** Dismiss the sheet */
  dismiss: () => void;
};

type BottomSheetProps = Omit<BottomSheetModalProps, 'children' | 'onChange'> & {
  children: ReactNode;
  onChange?: (index: number) => void;
};

/**
 * BottomSheet component
 * @param props
 */
function BottomSheet(props: BottomSheetProps, ref: ForwardedRef<BottomSheetRef>) {
  const {
    children,
    onChange,
    onDismiss,
    backdropComponent = DefaultBackdrop,
    handleIndicatorStyle,
    backgroundStyle,
    ...sheetProps
  } = props;

  // Hook
  const { top } = useSafeAreaInsets();
  const [background, mutedForeground] = useCSSVariable(['--background', '--muted-foreground']);

  // Reference
  const sheetRef = useRef<BottomSheetModal>(null);
  const presentedRef = useRef(false);

  // Callback
  const present = useCallback(() => {
    presentedRef.current = true;
    sheetRef.current?.present();
  }, []);

  const presented = useCallback(() => presentedRef.current, []);

  const dismiss = useCallback(() => {
    presentedRef.current = false;
    sheetRef.current?.dismiss();
  }, []);

  const handleChange = useCallback(
    (index: number) => {
      presentedRef.current = index >= 0;
      onChange?.(index);
    },
    [onChange],
  );

  const handleDismiss = useCallback(() => {
    presentedRef.current = false;
    onDismiss?.();
  }, [onDismiss]);

  // Imperative handle
  useImperativeHandle(
    ref,
    () => ({
      present,
      presented,
      dismiss,
    }),
    [present, presented, dismiss],
  );

  // Render
  return (
    <BottomSheetModal
      ref={sheetRef}
      onChange={handleChange}
      onDismiss={handleDismiss}
      backdropComponent={backdropComponent}
      topInset={top}
      handleIndicatorStyle={[
        { backgroundColor: mutedForeground?.toString() },
        handleIndicatorStyle,
      ]}
      backgroundStyle={[{ backgroundColor: background?.toString() }, backgroundStyle]}
      {...sheetProps}
    >
      {children}
    </BottomSheetModal>
  );
}

function DefaultBackdrop(props: BottomSheetBackdropProps) {
  // Render
  return (
    <BottomSheetBackdrop
      {...props}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      pressBehavior='close'
    />
  );
}

export default forwardRef<BottomSheetRef, BottomSheetProps>(BottomSheet);
