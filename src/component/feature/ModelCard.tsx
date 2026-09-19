import { CircleCheckIcon, DownloadIcon, TrashIcon, TriangleAlertIcon } from 'lucide-react-native';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { useModelDownloadStore, useTranscriptionModelStore } from '../../store/store';
import type { Model } from '../../type/entity';
import { showAlert } from '../../util/alert';
import { formatBytes } from '../../util/formatter';
import { deleteModel, downloadModel, getDownloadStatus } from '../../util/model';
import { clx } from '../../util/util';
import ActivityIndicator from '../common/ActivityIndicator';
import Icon from '../common/Icon';
import LocaleText from '../common/LocaleText';

type ModelCardStatus = 'not-downloaded' | 'downloading' | 'downloaded' | 'selected';

type ModelCardProps = {
  model: Model;
};

function ModelCard(props: ModelCardProps) {
  const { model } = props;

  // Global state
  const download = useModelDownloadStore(state => state.downloads[model.id]);
  const selectedTranscriptionModelId = useTranscriptionModelStore(state => state.id);
  const setTranscriptionModelId = useTranscriptionModelStore(state => state.setId);

  // State
  const [updater, setUpdater] = useState<number>(0);

  // Memo
  const selected = selectedTranscriptionModelId === model.id;
  const downloading = download !== undefined;

  const diskStatus = useMemo(() => getDownloadStatus(model), [updater, model, download]);

  const status = useMemo<ModelCardStatus>(() => {
    if (selected) return 'selected';
    if (downloading) return 'downloading';
    return diskStatus === 'downloaded' ? 'downloaded' : 'not-downloaded';
  }, [selected, downloading, diskStatus]);

  const mainClassName = useMemo(
    () =>
      clx(
        'flex-row items-center gap-base rounded bg-surface p-base',
        selected ? 'border border-primary' : 'border border-transparent',
      ),
    [selected],
  );

  // Callback
  const handlePress = useCallback(() => {
    if (downloading || selected) return;
    if (diskStatus === 'degraded') {
      deleteModel(model);
      void downloadModel(model);
      return;
    }
    if (diskStatus === 'downloaded') {
      setTranscriptionModelId(model.id);
      return;
    }
    void downloadModel(model);
  }, [downloading, selected, diskStatus, setTranscriptionModelId, model]);

  const handleDelete = useCallback(() => {
    showAlert('general:warning', 'general:confirmModelDelete', [
      { text: 'general:cancel', style: 'cancel' },
      {
        text: 'general:delete',
        style: 'destructive',
        onPress: () => {
          deleteModel(model);
          setUpdater(prev => (prev + 1) % 2);
        },
      },
    ]);
  }, [model]);

  // Render
  return (
    <Pressable
      className={mainClassName}
      onPress={handlePress}
      disabled={downloading || selected}
      style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
    >
      <View className='flex-1 gap-sm'>
        <View className='flex-row items-center gap-sm'>
          <LocaleText text={model.name} avoidTranslation className='text-base font-semibold' />
          {diskStatus === 'degraded' && !downloading && (
            <Icon icon={TriangleAlertIcon} size={16} color='destructive' />
          )}
        </View>
        <LocaleText
          text={formatBytes(model.size)}
          avoidTranslation
          className='text-sm text-muted-foreground'
        />
      </View>
      <View className='min-w-24 flex-row items-center justify-end gap-sm'>
        {downloading && (
          <>
            <Text className='text-sm font-medium text-muted-foreground'>
              {Math.round(download.progress * 100)}%
            </Text>
            <ActivityIndicator size='small' />
          </>
        )}
        {status === 'not-downloaded' ? (
          <Icon icon={DownloadIcon} size={20} color='muted-foreground' className='p-sm' />
        ) : status === 'selected' ? (
          <Icon icon={CircleCheckIcon} size={20} color='primary' className='p-sm' />
        ) : null}
      </View>
      {diskStatus && !downloading && !selected && (
        <Icon
          icon={TrashIcon}
          size={20}
          color='destructive'
          onPress={handleDelete}
          className='p-sm'
        />
      )}
    </Pressable>
  );
}

export default ModelCard;
