import { eq } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { useMemo } from 'react';
import { View } from 'react-native';
import Button from '../component/common/Button';
import LocaleText from '../component/common/LocaleText';
import MarkdownView from '../component/common/Markdown';
import Header from '../component/feature/Header';
import BaseScreen from '../component/navigation/BaseScreen';
import { db } from '../config/client';
import { notesTable } from '../database/schema';
import type { NoteScreenProps } from '../type/navigation';
import { formatDate } from '../util/formatter';

function NoteScreen({ navigation, route }: NoteScreenProps) {
  const { noteId } = route.params;

  // Global state
  const { data, error } = useLiveQuery(
    db.select().from(notesTable).where(eq(notesTable.id, noteId)),
    [noteId],
  );

  // Memo
  const note = useMemo(() => data.at(0), [data]);

  // Render
  return (
    <BaseScreen className='gap-base'>
      {error ? (
        <View className='flex-1 items-center justify-center'>
          <LocaleText text='general:error' className='text-h2' />
        </View>
      ) : !note ? (
        <View className='flex-1 items-center justify-center gap-base'>
          <LocaleText text='note:notFound' className='text-h3' />
          <Button text='general:goBack' onPress={() => navigation.goBack()} />
        </View>
      ) : (
        <>
          <Header title={formatDate(note.createdAt)} avoidTranslation />
          <MarkdownView markdown={note.content} />
        </>
      )}
    </BaseScreen>
  );
}

export default NoteScreen;
