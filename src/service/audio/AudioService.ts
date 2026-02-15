import { AudioRecorder, FileDirectory, FileFormat } from 'react-native-audio-api';

class AudioService {
  private readonly recorder: AudioRecorder = new AudioRecorder();

  public startRecording() {
    const timestamp = Date.now();

    this.recorder.enableFileOutput({
      format: FileFormat.M4A,
      directory: FileDirectory.Document,
      fileNamePrefix: `recording_${timestamp}`,
      channelCount: 1,
    });

    const result = this.recorder.start();
    if (result.status === 'error') throw new Error(result.message);

    return Promise.resolve(result);
  }

  public async stopRecording() {
    const result = this.recorder.stop();
    if (result.status === 'error') throw new Error(result.message);

    return Promise.resolve(result);
  }
}

export default AudioService;
