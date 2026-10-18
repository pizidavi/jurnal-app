import { useEffect } from 'react';

import { cleanupDownloads } from '../util/model';

/**
 * Hook to perform startup tasks when the application is initialized
 */
function useStartup() {
  // Effect
  useEffect(() => {
    cleanupDownloads();
  }, []);
}

export default useStartup;
