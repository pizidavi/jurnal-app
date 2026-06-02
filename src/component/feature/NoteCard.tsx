import { View } from 'react-native';
import { useResolveClassNames } from 'uniwind';

import type { Note } from '../../database/schema';
import { formatDate } from '../../util/formatter';
import { clx } from '../../util/util';
import LocaleText from '../common/LocaleText';
import MarkdownView from '../common/Markdown';

type NoteCardProps = {
  note: Note;
  className?: string;
};

function NoteCard(props: NoteCardProps) {
  const { note, className } = props;

  // Hook
  const height = useResolveClassNames('h-52');

  // Render
  return (
    <View className={clx('gap-sm', className)}>
      <View className='rounded bg-surface p-sm'>
        <MarkdownView
          content={note.content}
          textSize='sm'
          style={[height, { overflow: 'hidden' }]}
        />
      </View>
      <View className='items-center justify-center'>
        <LocaleText
          text={formatDate(note.createdAt)}
          className='text-sm text-muted-foreground'
          avoidTranslation
        />
      </View>
    </View>
  );
}

export default NoteCard;
