import { File, Paths } from 'expo-file-system';

import transcriptionModels from '../../assets/transcription-models.json';
import { useModelDownloadStore, useSettingsStore } from '../store/store';
import type { Model } from '../type/entity';
import { appLog } from '../util/logger';

const MODEL_DIRECTORY = 'whisper-models';
const DOWNLOAD_POLL_INTERVAL = 500;

export const MODELS = transcriptionModels satisfies Model[];

export const getModelById = (id: Model['id']) => MODELS.find(model => model.id === id);

export const getModelFilename = (model: Model) =>
  new File(Paths.document, MODEL_DIRECTORY, model.fileName);

export const getDownloadStatus = (model: Model): 'downloaded' | 'degraded' | undefined => {
  const file = getModelFilename(model);
  if (!file.exists) return undefined;
  return file.size === model.size ? 'downloaded' : 'degraded';
};

const setProgress = (id: Model['id'], progress: number) =>
  useModelDownloadStore.setState(prev => ({
    downloads: { ...prev.downloads, [id]: { progress } },
  }));

const removeDownload = (id: Model['id']) =>
  useModelDownloadStore.setState(prev => ({
    downloads: Object.fromEntries(Object.entries(prev.downloads).filter(([key]) => key !== id)),
  }));

export const downloadModel = async (model: Model) => {
  if (useModelDownloadStore.getState().downloads[model.id] !== undefined) return;

  setProgress(model.id, 0);

  const file = getModelFilename(model);
  file.parentDirectory.create({ intermediates: true, idempotent: true });

  const interval = setInterval(
    () => setProgress(model.id, Math.min(file.size / model.size, 1)),
    DOWNLOAD_POLL_INTERVAL,
  );

  let result: 'downloaded' | 'degraded' | 'error';
  try {
    appLog.debug(`Downloading transcription model ${model.id} from ${model.url}`);
    await File.downloadFileAsync(model.url, file, { idempotent: true });
    appLog.debug(`Downloaded transcription model ${model.id} to ${file.uri}`);
    result = file.size === model.size ? 'downloaded' : 'degraded';
  } catch (e) {
    appLog.error(`Failed to download transcription model ${model.id}`, e);
    if (file.exists) file.delete();
    result = 'error';
  } finally {
    clearInterval(interval);
  }

  removeDownload(model.id);

  if (result === 'downloaded' && useSettingsStore.getState().transcriptionModelId === undefined) {
    useSettingsStore.getState().setTranscriptionModelId(model.id);
  }
};

export const deleteModel = (model: Model) => {
  if (useSettingsStore.getState().transcriptionModelId === model.id) return;

  const file = getModelFilename(model);
  if (file.exists) file.delete();
  appLog.debug(`Deleted transcription model ${model.id}`);
  removeDownload(model.id);
};
