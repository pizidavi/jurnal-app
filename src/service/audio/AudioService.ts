import { AudioRecorder, FileDirectory, FileFormat, FilePreset } from 'react-native-audio-api';

class AudioService {
  private readonly recorder: AudioRecorder = new AudioRecorder();

  public async startRecording() {
    const timestamp = Date.now();

    this.recorder.enableFileOutput({
      format: FileFormat.Wav,
      directory: FileDirectory.Document,
      fileNamePrefix: `recording_${timestamp}`,
      channelCount: 1,
      preset: FilePreset.Medium,
    });

    const result = this.recorder.start();
    if (result.status === 'error') throw new Error(result.message);

    return Promise.resolve(result);
  }

  public async stopRecording() {
    const result = this.recorder.stop();
    if (result.status === 'error') throw new Error(result.message);

    return Promise.resolve({
      path: result.paths[0],
      duration: result.duration,
    });
  }
}

export default AudioService;
