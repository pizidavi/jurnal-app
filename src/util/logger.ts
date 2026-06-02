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

const apiLog = log.extend('API');
const appLog = log.extend('APP');
const llmLog = log.extend('LLM');
const transcriptionLog = log.extend('TRANSCRIPTION');

export { apiLog, appLog, llmLog, transcriptionLog };
