import { apiLog } from '../util/logger';

export const fetchDownloadSize = async (url: string) => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const size = Number(response.headers.get('content-length'));
    if (!Number.isFinite(size) || size === 0)
      throw new Error(
        `Invalid content-length header: ${response.headers.get('content-length') ?? 'unknown'}`,
      );
    apiLog.debug(`HEAD request for ${url} returned content-length: ${size}`);
    return size;
  } catch (e) {
    apiLog.warn(`HEAD request failed for ${url}`, e);
  }
  return undefined;
};
