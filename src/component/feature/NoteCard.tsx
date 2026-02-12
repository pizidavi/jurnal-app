import { useMemo } from 'react';
import { View } from 'react-native';
import type { Note } from '../../database/schema';
import { formatDate } from '../../util/formatter';
import { clx } from '../../util/util';
import LocaleText from '../common/LocaleText';

type NoteCardProps = {
  note: Note;
  className?: string;
};

function NoteCard(props: NoteCardProps) {
  const { note, className } = props;

  // Memo
  const content = useMemo(() => note.content.slice(0, 200), [note.content]);

  // Render
  return (
    <View className={clx('gap-sm', className)}>
      <View className='h-56 rounded bg-surface p-sm'>
        <LocaleText text={content} className='text-justify text-sm' avoidTranslation />
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
