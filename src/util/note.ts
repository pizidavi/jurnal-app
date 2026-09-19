import { appLog } from './logger';

export const processNote = async (path: string): Promise<void> => {
  appLog.debug('Processing note', { path });
  await new Promise(resolve => setTimeout(resolve, 1_000));
  // todo
};
