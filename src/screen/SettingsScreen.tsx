import { useCallback, useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import Button from '../component/common/Button';
import LocaleText from '../component/common/LocaleText';
import TextInput from '../component/common/TextInput';
import Header from '../component/feature/Header';
import BaseScreen from '../component/navigation/BaseScreen';
import { DEFAULT_PROVIDER_URLS, getLLMConfig, setLLMConfig } from '../store/llm-config';
import type { LLMConfig } from '../type/struct';
import { clx } from '../util/util';

type Provider = LLMConfig['provider'];

const PROVIDERS: { value: Provider; label: string }[] = [
  { value: 'openai', label: 'OpenAI' },
  { value: 'openrouter', label: 'OpenRouter' },
  { value: 'custom', label: 'Custom' },
];

function SettingsScreen() {
  // State
  const [provider, setProvider] = useState<Provider>('openai');
  const [baseURL, setBaseURL] = useState<string>(DEFAULT_PROVIDER_URLS.openai);
  const [apiKey, setApiKey] = useState<string>('');

  // Callback
  const handleProviderChange = useCallback((newProvider: Provider) => {
    setProvider(newProvider);
    // Auto-fill base URL for OpenAI and OpenRouter
    if (newProvider === 'openai') {
      setBaseURL(DEFAULT_PROVIDER_URLS.openai);
    } else if (newProvider === 'openrouter') {
      setBaseURL(DEFAULT_PROVIDER_URLS.openrouter);
    } else {
      setBaseURL('');
    }
  }, []);

  const handleSave = useCallback(() => {
    const config: LLMConfig = {
      provider,
      baseURL,
      apiKey,
    };
    setLLMConfig(config);
  }, [provider, baseURL, apiKey]);

  // Memo
  const getProviderButtonClassName = useCallback(
    (isSelected: boolean) =>
      clx(
        'flex flex-1 items-center justify-center rounded border py-sm',
        isSelected ? 'border-primary bg-primary' : 'border-primary bg-background',
      ),
    [],
  );

  const getProviderTextClassName = useCallback(
    (isSelected: boolean) =>
      clx('text-center font-semibold', isSelected ? 'text-primary-foreground' : 'text-primary'),
    [],
  );

  // Effect
  useEffect(() => {
    const config = getLLMConfig();
    if (config) {
      setProvider(config.provider);
      setBaseURL(config.baseURL);
      setApiKey(config.apiKey);
    }
  }, []);

  // Render
  return (
    <BaseScreen className='gap-base'>
      <Header title='general:settings' />

      {/* Provider Selector */}
      <View className='gap-sm'>
        <LocaleText text='general:llmProvider' className='text-h4' />
        <View className='flex-row gap-sm'>
          {PROVIDERS.map(p => {
            const isSelected = provider === p.value;
            return (
              <Pressable
                key={p.value}
                className={getProviderButtonClassName(isSelected)}
                onPress={() => handleProviderChange(p.value)}
                style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
              >
                <LocaleText
                  text={p.label}
                  className={getProviderTextClassName(isSelected)}
                  avoidTranslation
                />
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Base URL Input */}
      <View className='gap-sm'>
        <LocaleText text='general:baseURL' className='text-h4' />
        <TextInput
          value={baseURL}
          onChangeText={setBaseURL}
          placeholder='https://api.example.com/v1'
          autoCapitalize='none'
          autoCorrect={false}
          editable={provider === 'custom'}
        />
      </View>

      {/* API Key Input */}
      <View className='gap-sm'>
        <LocaleText text='general:apiKey' className='text-h4' />
        <TextInput
          value={apiKey}
          onChangeText={setApiKey}
          placeholder='sk-...'
          autoCapitalize='none'
          autoCorrect={false}
          secureTextEntry
        />
      </View>
      <Button text='general:save' onPress={handleSave} />
    </BaseScreen>
  );
}

export default SettingsScreen;
