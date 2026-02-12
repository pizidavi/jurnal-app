import { useCallback, useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Text, type TextProps } from 'react-native';
import { type Dictionary } from '../../locale';
import { clx } from '../../util/util';

export type LocaleTextProps<T extends boolean = false> = {
  /** Text */
  text: T extends false ? Dictionary : string | number;
  /** Avoid translation */
  avoidTranslation?: T;
  /** Values */
  values?: Record<string, Dictionary | (string & {}) | number>;
  /** Components */
  components?: readonly React.ReactElement[] | Record<string, React.ReactElement>;
} & Omit<TextProps, 'children'>;

/**
 * LocaleText component
 * @param props
 */
function LocaleText<T extends boolean = false>(props: LocaleTextProps<T>) {
  const { text, avoidTranslation, className, values, components, ...rest } = props;

  // Hooks
  const { t } = useTranslation();

  // Memos
  const translatedValues = useMemo(() => {
    if (!values) return undefined;
    return Object.entries(values).reduce<typeof values>((acc, [key, value]) => {
      acc[key] = typeof value === 'string' ? t(value) : value;
      return acc;
    }, {});
  }, [t, values]);

  // Callbacks
  const BaseText = useCallback(
    (props: { children: React.ReactNode }) => (
      <Text
        className={clx('text-base font-medium text-foreground', className)}
        {...rest}
        {...props}
      />
    ),
    [className, rest],
  );

  // Render
  return avoidTranslation ? (
    <BaseText>{text}</BaseText>
  ) : (
    <Trans
      i18nKey={text.toString() as any}
      values={translatedValues}
      components={components}
      parent={BaseText}
    />
  );
}
export default LocaleText;
