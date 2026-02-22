import { Markdown, type StyleMap } from '@docren/react-native-markdown';
import { useMemo } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { useCSSVariable } from 'uniwind';

type MarkdownViewProps = {
  markdown: string;
  textSize?: 'sm' | 'base';
  style?: StyleProp<ViewStyle>;
};

function MarkdownView(props: MarkdownViewProps) {
  const { markdown, textSize = 'base', style } = props;

  // Hook
  const variables = useCSSVariable(['--foreground', '--text-sm', '--text-base']);

  // Memo
  const markdownStyles = useMemo<StyleMap>(() => {
    const [colorForeground, textSm, textBase] = variables;

    const foreground = colorForeground?.toString() ?? '#000';
    const textFontSize =
      textSize === 'sm' ? Number(textSm?.toString() ?? '14') : Number(textBase?.toString() ?? '16');

    return {
      root: style,
      text: {
        color: foreground,
        fontSize: textFontSize,
      },
      listBullet: {
        color: foreground,
      },
    } satisfies StyleMap;
  }, [textSize, style, variables]);

  // Render
  return <Markdown markdown={markdown} styles={markdownStyles} />;
}

export default MarkdownView;
