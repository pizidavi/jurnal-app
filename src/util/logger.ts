import { consoleTransport, logger } from 'react-native-logs';

const log = logger.createLogger({
  transport: consoleTransport,
  severity: 'debug',
  transportOptions: {
    colors: {
      info: 'blueBright',
      warn: 'yellowBright',
      error: 'redBright',
    },
  },
});

export const apiLog = log.extend('API');
export const appLog = log.extend('APP');
export const serviceLog = log.extend('SERVICE');
export const llmLog = log.extend('LLM');
export const transcriptionLog = log.extend('TRANSCRIPTION');
