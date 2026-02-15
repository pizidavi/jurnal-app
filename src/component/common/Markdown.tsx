import { Markdown, type StyleMap } from '@docren/react-native-markdown';
import { useMemo } from 'react';
import { useCSSVariable } from 'uniwind';

type MarkdownViewProps = {
  markdown: string;
};

function MarkdownView(props: MarkdownViewProps) {
  const { markdown } = props;

  // Hook
  const [colorForeground] = useCSSVariable(['--foreground']);

  // Memo
  const markdownStyles = useMemo<StyleMap>(() => {
    const foreground = colorForeground?.toString() ?? '#000';
    return {
      text: {
        color: foreground,
      },
      listBullet: {
        color: foreground,
      },
    } satisfies StyleMap;
  }, [colorForeground]);

  // Render
  return <Markdown markdown={markdown} styles={markdownStyles} />;
}

export default MarkdownView;
