import { AudioContext } from 'react-native-audio-api';
import {
  type SpeechToTextLanguage,
  SpeechToTextModule,
  WHISPER_SMALL,
} from 'react-native-executorch';
import { transcriptionLog } from '../../util/logger';

class AIService {
  private readonly model = new SpeechToTextModule();

  public async loadTranscriptionModel(onDownloadProgressCallback?: (progress: number) => void) {
    await this.model.load(WHISPER_SMALL, onDownloadProgressCallback);
  }

  public async transcribeAudio(fileUri: string, language: SpeechToTextLanguage): Promise<string> {
    const audioContext = new AudioContext({ sampleRate: 16000 });
    const decodedAudioData = await audioContext.decodeAudioData(fileUri);
    const audioBuffer = decodedAudioData.getChannelData(0);

    const transcription = await (async (): Promise<string> => {
      let retry = 0;
      do {
        try {
          const result = await this.model.transcribe(audioBuffer, { language });
          const _ = result
            .trimEnd()
            .replace(/\[\w+\]$/g, '') // Remove trailing [noise], [laughter], etc.
            .trim();
          if (_.length < 4) throw new Error('Transcription result is empty');
          return _;
        } catch (e) {
          transcriptionLog.error(`Transcription attempt ${retry + 1} failed`, e);
          retry++;
          if (retry >= 3) throw new Error('Failed to transcribe audio after 3 attempts');
        }
        // eslint-disable-next-line no-constant-condition, @typescript-eslint/no-unnecessary-condition
      } while (true);
    })();

    return transcription;
  }
}

export default AIService;
