import { useNavigation } from '@react-navigation/native';
import { count } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { useCallback, useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import LocaleText from '../component/common/LocaleText';
import NoteCard from '../component/feature/NoteCard';
import BaseScreen from '../component/navigation/BaseScreen';
import { db } from '../config/client';
import { type Note, notesTable } from '../database/schema';
import type { AppNavigationProp } from '../type/navigation';

const PAGE_SIZE = 20;

function HomeScreen() {
  // Hook
  const navigation = useNavigation<AppNavigationProp>();

  // State
  const [page, setPage] = useState(1);

  // Api
  const { data: notesCount } = useLiveQuery(db.select({ count: count() }).from(notesTable), []);
  const { data: notes } = useLiveQuery(
    db
      .select()
      .from(notesTable)
      .limit(page * PAGE_SIZE),
    [page],
  );

  // Callback
  const renderItem = useCallback(
    ({ item }: { item: Note }) => (
      <Pressable
        className='w-[48%]'
        onPress={() => navigation.navigate('Note', { noteId: item.id })}
      >
        <NoteCard note={item} />
      </Pressable>
    ),
    [],
  );

  // Render
  return (
    <BaseScreen as='view' className='gap-base px-0 pb-0'>
      <View className='px-base'>
        <LocaleText text='general:hello' className='text-h3' />
      </View>
      <FlatList
        data={notes}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        numColumns={2}
        contentContainerClassName='gap-base grow px-base pb-base'
        columnWrapperClassName='gap-base'
        onEndReached={() => {
          if (notes.length < (notesCount.at(0)?.count ?? 0)) setPage(prev => prev + 1);
        }}
        onEndReachedThreshold={0.5}
      />
    </BaseScreen>
  );
}

export default HomeScreen;
