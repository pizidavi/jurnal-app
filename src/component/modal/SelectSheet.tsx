import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { ChevronRightIcon } from 'lucide-react-native';
import { type ForwardedRef, type ReactElement, useMemo, useRef } from 'react';
import { Pressable } from 'react-native';

import type { Dictionary } from '../../locale';
import type { BottomSheetRef } from '../common/BottomSheet';
import BottomSheet from '../common/BottomSheet';
import Icon from '../common/Icon';
import LocaleText from '../common/LocaleText';

const SNAP_POINTS = ['70%'];

type SelectSheetRenderItem<T> = (
  item: T,
  isSelected: boolean,
  select: () => void,
) => ReactElement | null;

type SelectSheetProps<T> = {
  ref?: ForwardedRef<BottomSheetRef>;
  title?: Dictionary;
  options: T[];
  selected?: T;
  keyExtractor: (item: T) => string;
  renderItem: SelectSheetRenderItem<T>;
  onSelect: (item: T) => void;
};

function SelectSheet<T>(props: SelectSheetProps<T>) {
  const { ref, title, options, selected, keyExtractor, renderItem, onSelect } = props;

  // Render
  return (
    <BottomSheet ref={ref} snapPoints={SNAP_POINTS}>
      {title !== undefined && <LocaleText text={title} className='px-base pb-base text-h3' />}
      <BottomSheetFlatList
        data={options}
        keyExtractor={keyExtractor}
        renderItem={({ item }) =>
          renderItem(
            item,
            selected !== undefined && keyExtractor(selected) === keyExtractor(item),
            () => onSelect(item),
          )
        }
        contentContainerClassName='gap-base grow px-base pb-20'
      />
    </BottomSheet>
  );
}

type SelectSheetSelectProps<T> = SelectSheetProps<T> & {
  label: Dictionary;
  placeholder?: Dictionary;
  getOptionLabel: (item: T) => string;
};

function Select<T>(props: SelectSheetSelectProps<T>) {
  const { label, placeholder, getOptionLabel, ...sheetProps } = props;

  // Reference
  const sheetRef = useRef<BottomSheetRef>(null);

  // Memo
  const value = useMemo(
    () => (sheetProps.selected !== undefined ? getOptionLabel(sheetProps.selected) : undefined),
    [sheetProps.selected, getOptionLabel],
  );

  // Render
  return (
    <>
      <Pressable
        className='flex-row items-center gap-base rounded bg-surface p-base'
        onPress={() => sheetRef.current?.present()}
        style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
      >
        <LocaleText text={label} className='flex-1 text-base font-medium' />
        {value !== undefined ? (
          <LocaleText text={value} avoidTranslation className='text-base text-muted-foreground' />
        ) : (
          placeholder !== undefined && (
            <LocaleText text={placeholder} className='text-base text-muted-foreground' />
          )
        )}
        <Icon icon={ChevronRightIcon} size={20} color='muted-foreground' />
      </Pressable>
      <SelectSheet ref={sheetRef} {...sheetProps} />
    </>
  );
}

SelectSheet.Select = Select;

export default SelectSheet;
