import { t } from 'i18next';
import { Alert, ToastAndroid } from 'react-native';

import type { Dictionary } from '../locale';

export const showAlert = (
  title: Dictionary,
  body: Dictionary | Dictionary[],
  buttons?: {
    text: Dictionary;
    onPress?: () => void;
    style?: 'default' | 'cancel' | 'destructive';
    disabled?: boolean;
  }[],
) =>
  Alert.alert(
    t(title),
    Array.isArray(body)
      ? body.map(b => t(b)).join('\n')
      : // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        t(body) || body,
    buttons
      ?.filter(b => !b.disabled)
      .map(b => ({
        text:
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          t(b.text) || b.text,
        style: b.style,
        onPress: b.onPress,
      })),
  );

export const showToastAndroid = (title: Dictionary) =>
  ToastAndroid.show(t(title), ToastAndroid.SHORT);
