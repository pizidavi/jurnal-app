import { count, desc } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { ArrowDownIcon, ArrowUpRightIcon, SettingsIcon } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';

import Icon from '../component/common/Icon';
import LocaleText from '../component/common/LocaleText';
import Header from '../component/feature/Header';
import NoteCard from '../component/feature/NoteCard';
import RecordButton from '../component/feature/RecordButton';
import BaseScreen from '../component/navigation/BaseScreen';
import { db } from '../config/client';
import { type Note, notesTable } from '../database/schema';
import type { HomeScreenProps } from '../type/navigation';

const PAGE_SIZE = 50;

function HomeScreen({ navigation }: HomeScreenProps) {
  // State
  const [page, setPage] = useState(1);

  // Api
  const { data: notesCount } = useLiveQuery(db.select({ count: count() }).from(notesTable), []);
  const { data: notes } = useLiveQuery(
    db
      .select()
      .from(notesTable)
      .orderBy(desc(notesTable.createdAt))
      .limit(page * PAGE_SIZE),
    [page],
  );

  // Callback
  const handleEndReached = useCallback(() => {
    if (notes.length < (notesCount.at(0)?.count ?? 0)) setPage(prev => prev + 1);
  }, [notes, notesCount]);

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
      <Header
        title='general:hello'
        icon={SettingsIcon}
        onIconPress={() => navigation.navigate('Settings')}
        className='px-base'
      />
      <FlatList
        data={notes}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        numColumns={2}
        contentContainerClassName='gap-base grow px-base pb-20'
        columnWrapperClassName='gap-base'
        ListEmptyComponent={ListEmpty}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
      />
      <View className='absolute right-0 bottom-6 left-0 flex items-center justify-center'>
        <RecordButton />
      </View>
    </BaseScreen>
  );
}

function ListEmpty() {
  // Render
  return (
    <View className='flex-1 items-center justify-evenly px-base'>
      <View className='items-center gap-base'>
        <Icon icon={ArrowUpRightIcon} size={30} color='foreground' />
        <LocaleText text='onboarding:1-setupModels' className='text-center text-h4' />
      </View>
      <View className='items-center gap-base'>
        <LocaleText text='onboarding:2-pressButton' className='text-center text-h4' />
        <Icon icon={ArrowDownIcon} size={30} color='foreground' />
      </View>
    </View>
  );
}

export default HomeScreen;
