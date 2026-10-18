import { Directory, File, Paths } from 'expo-file-system';

import llmModels from '../../assets/llm-models.json';
import transcriptionModels from '../../assets/transcription-models.json';
import { fetchDownloadSize } from '../api';
import { useModelDownloadStore, useSettingsStore } from '../store/store';
import type { Model } from '../type/entity';
import { MODEL_KIND } from '../type/enum';
import type { ModelDownloadKey } from '../type/store';
import { showAlert } from './alert';
import { appLog } from './logger';

const MODEL_DIRECTORIES: Record<MODEL_KIND, string> = {
  [MODEL_KIND.TRANSCRIPTION]: 'whisper-models',
  [MODEL_KIND.LLM]: 'llm-models',
};

const MODEL_LISTS: Record<MODEL_KIND, Model[]> = {
  [MODEL_KIND.TRANSCRIPTION]: transcriptionModels satisfies Model[],
  [MODEL_KIND.LLM]: llmModels satisfies Model[],
};

const DOWNLOADS_DIRECTORY = 'downloads';

const DOWNLOAD_POLL_INTERVAL = 500;

export const getModels = (kind: MODEL_KIND) => MODEL_LISTS[kind];

export const getModelById = (kind: MODEL_KIND, id: Model['id']) =>
  MODEL_LISTS[kind].find(model => model.id === id);

export const getModelFilename = (model: Model, kind: MODEL_KIND) =>
  new File(Paths.document, MODEL_DIRECTORIES[kind], model.fileName);

export const getDownloadStatus = (model: Model, kind: MODEL_KIND): 'downloaded' | undefined =>
  getModelFilename(model, kind).exists ? 'downloaded' : undefined;

export const getDownloadKey = (model: Model, kind: MODEL_KIND): ModelDownloadKey =>
  `${kind}:${model.id}`;

export const cleanupDownloads = () => {
  const directory = new Directory(Paths.document, DOWNLOADS_DIRECTORY);
  if (!directory.exists) return;
  const entries = directory.list();
  if (entries.length === 0) return;
  appLog.debug(`Cleaning up ${entries.length} files in downloads directory ${directory.uri}`);
  try {
    directory.delete();
  } catch (e) {
    appLog.error(`Failed to clean up downloads directory ${directory.uri}`, e);
  }
};

const setProgress = (key: ModelDownloadKey, progress: number) =>
  useModelDownloadStore.setState(prev => ({
    downloads: { ...prev.downloads, [key]: { progress } },
  }));

const removeDownload = (key: ModelDownloadKey) =>
  useModelDownloadStore.setState(prev => ({
    downloads: Object.fromEntries(Object.entries(prev.downloads).filter(([k]) => k !== key)),
  }));

const isModelSelected = (model: Model, kind: MODEL_KIND) => {
  const state = useSettingsStore.getState();
  return kind === MODEL_KIND.TRANSCRIPTION
    ? state.transcriptionModelId === model.id
    : state.llmModelId === model.id;
};

const setModelIfMissing = (model: Model, kind: MODEL_KIND) => {
  const state = useSettingsStore.getState();
  if (kind === MODEL_KIND.TRANSCRIPTION) {
    if (state.transcriptionModelId === undefined) state.setTranscriptionModelId(model.id);
    return;
  }
  if (state.llmModelId === undefined) state.setLlmModelId(model.id);
};

export const downloadModel = async (model: Model, kind: MODEL_KIND) => {
  const key = getDownloadKey(model, kind);
  if (useModelDownloadStore.getState().downloads[key] !== undefined) return;

  setProgress(key, 0);

  const file = getModelFilename(model, kind);
  const tempFile = new File(Paths.document, DOWNLOADS_DIRECTORY, model.fileName);
  tempFile.parentDirectory.create({ intermediates: true, idempotent: true });
  file.parentDirectory.create({ intermediates: true, idempotent: true });

  const totalSize = (await fetchDownloadSize(model.url)) ?? model.size;

  const interval = setInterval(
    () => setProgress(key, Math.min(tempFile.size / totalSize, 1)),
    DOWNLOAD_POLL_INTERVAL,
  );

  try {
    appLog.debug(`Downloading ${kind} model ${model.id} from ${model.url}`);
    await File.downloadFileAsync(model.url, tempFile, { idempotent: true });
    appLog.debug(`Downloaded ${kind} model ${model.id} to ${tempFile.uri}`);
    if (file.exists) file.delete();
    tempFile.move(file);
    setModelIfMissing(model, kind);
  } catch (e) {
    appLog.error(`Failed to download ${kind} model ${model.id}`, e);
    if (tempFile.exists) tempFile.delete();
    showAlert('general:error', 'error:modelDownloadFailed');
  } finally {
    clearInterval(interval);
  }

  removeDownload(key);
};

export const deleteModel = (model: Model, kind: MODEL_KIND) => {
  if (isModelSelected(model, kind)) return;

  const file = getModelFilename(model, kind);
  if (file.exists) file.delete();
  appLog.debug(`Deleted ${kind} model ${model.id}`);
  removeDownload(getDownloadKey(model, kind));
};
