import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { View } from 'react-native';
import Button from '../component/common/Button';
import LocaleText from '../component/common/LocaleText';
import MarkdownView from '../component/common/Markdown';
import Header from '../component/feature/Header';
import BaseScreen from '../component/navigation/BaseScreen';
import { db } from '../config/client';
import type { NoteScreenProps } from '../type/navigation';
import { formatDate } from '../util/formatter';

function NoteScreen({ navigation, route }: NoteScreenProps) {
  const { noteId } = route.params;

  // Global state
  const { data: note, error } = useLiveQuery(
    db.query.notesTable.findFirst({
      where: (notesTable, { eq }) => eq(notesTable.id, noteId),
    }),
    [noteId],
  );

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
