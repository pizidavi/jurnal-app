import { AudioContext } from 'react-native-audio-api';
import { models, type SpeechToTextLanguage, SpeechToTextModule } from 'react-native-executorch';

import { transcriptionLog } from '../../util/logger';

class AIService {
  private model: SpeechToTextModule | undefined = undefined;

  public async loadTranscriptionModel(onDownloadProgressCallback?: (progress: number) => void) {
    this.model = await SpeechToTextModule.fromModelName(
      models.speech_to_text.whisper_base(),
      undefined,
      onDownloadProgressCallback,
    )
      .then(module => {
        transcriptionLog.info('Transcription model loaded successfully');
        onDownloadProgressCallback?.(1);
        return module;
      })
      .catch(error => {
        transcriptionLog.error('Failed to load transcription model', error);
        throw error;
      });
  }

  public async transcribeAudio(fileUri: string, language: SpeechToTextLanguage): Promise<string> {
    if (!this.model) throw new Error('Transcription model is not loaded');

    const audioContext = new AudioContext({ sampleRate: 16000 });
    const decodedAudioData = await audioContext.decodeAudioData(fileUri);
    const audioBuffer = decodedAudioData.getChannelData(0);

    let retry = 0;
    do {
      try {
        const result = await this.model.transcribe(audioBuffer, { language });
        const _ = result.text
          .trimEnd()
          .replace(/\[\w+\]$/g, '') // Remove trailing [noise], [laughter], etc.
          .trim();
        if (_.length < 4) throw new Error('Transcription result is empty');
        return _;
      } catch (e) {
        transcriptionLog.error(`Transcription attempt ${retry + 1} failed`, e);
        retry++;
        if (retry >= 3) throw new Error(`Failed to transcribe audio after ${retry} attempts`);
      }
      // eslint-disable-next-line no-constant-condition, @typescript-eslint/no-unnecessary-condition
    } while (true);
  }
}

export default AIService;
