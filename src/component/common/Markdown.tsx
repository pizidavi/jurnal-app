import { Markdown, type StyleMap } from '@docren/react-native-markdown';
import { useMemo } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { useCSSVariable } from 'uniwind';

type MarkdownViewProps = {
  content: string;
  textSize?: 'sm' | 'base';
  style?: StyleProp<ViewStyle>;
};

function MarkdownView(props: MarkdownViewProps) {
  const { content, textSize = 'base', style } = props;

  // Hook
  const [colorForeground, textSm, textBase] = useCSSVariable([
    '--foreground',
    '--text-sm',
    '--text-base',
  ]);

  // Memo
  const markdownStyles = useMemo<StyleMap>(() => {
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
  }, [textSize, style, colorForeground, textSm, textBase]);

  // Render
  return <Markdown markdown={content} styles={markdownStyles} />;
}

export default MarkdownView;
