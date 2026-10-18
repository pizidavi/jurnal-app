import { PauseIcon, PlayIcon } from 'lucide-react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import { AudioBufferSourceNode, AudioContext, decodeAudioData } from 'react-native-audio-api';

import { appLog } from '../../util/logger';
import Icon from '../common/Icon';
import LocaleText from '../common/LocaleText';

type AudioPlayerBarProps = {
  /** Audio file path */
  path: string;
};

/**
 * Audio player bar
 * @param props
 */
function AudioPlayerBar(props: AudioPlayerBarProps) {
  const { path } = props;

  // State
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  // Reference
  const audioContextRef = useRef<AudioContext | null>(null);

  // Callback
  const closeAudioContext = useCallback(() => {
    audioContextRef.current?.close().catch(e => {
      appLog.warn('Failed to close audio context', { e });
    });
    audioContextRef.current = null;
  }, []);

  const startPlayback = useCallback(async () => {
    closeAudioContext();

    const buffer = await decodeAudioData(path);

    const context = new AudioContext();
    audioContextRef.current = context;

    const source = new AudioBufferSourceNode(context);
    source.buffer = buffer;
    source.connect(context.destination);
    source.onPositionChanged = event => {
      const { duration } = buffer;
      if (duration <= 0) return;
      setProgress(Math.min(event.value / duration, 1));
    };
    source.onEnded = () => {
      setIsPlaying(false);
      setProgress(1);
      closeAudioContext();
    };
    source.start();
    appLog.debug('Audio playback started', { path });

    setProgress(0);
    setIsPlaying(true);
  }, [closeAudioContext, path]);

  const handlePlayPress = useCallback(() => {
    if (!audioContextRef.current) {
      startPlayback().catch(e => {
        appLog.warn('Failed to start playback', { e });
      });
      return;
    }

    if (isPlaying)
      audioContextRef.current
        .suspend()
        .then(() => setIsPlaying(false))
        .catch(e => appLog.warn('Failed to suspend playback', { e }));
    else
      audioContextRef.current
        .resume()
        .then(() => setIsPlaying(true))
        .catch(e => appLog.warn('Failed to resume playback', { e }));
  }, [isPlaying, startPlayback]);

  // Effect
  useEffect(() => {
    return () => closeAudioContext();
  }, []);

  // Render
  return (
    <View className='gap-base rounded bg-surface p-base'>
      <Pressable className='flex-row items-center gap-sm' onPress={handlePlayPress}>
        <Icon icon={isPlaying ? PauseIcon : PlayIcon} size={20} color='primary' />
        <LocaleText text='note:originalAudio' className='flex-1 text-sm text-muted-foreground' />
      </Pressable>
      <View className='h-2 overflow-hidden rounded-full bg-muted'>
        <View className='h-full rounded-full bg-primary' style={{ width: `${progress * 100}%` }} />
      </View>
    </View>
  );
}

export default AudioPlayerBar;
