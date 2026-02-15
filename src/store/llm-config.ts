import type { LLMConfig } from '../type/struct';
import { localStorage } from './local';

const LLM_CONFIG_KEY = 'llm-config';

// Default provider base URLs
export const DEFAULT_PROVIDER_URLS = {
  openai: 'https://api.openai.com/v1',
  openrouter: 'https://openrouter.ai/api/v1',
} as const;

export function getLLMConfig(): LLMConfig | null {
  const stored = localStorage.getItem(LLM_CONFIG_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored) as LLMConfig;
  } catch {
    return null;
  }
}

export function setLLMConfig(config: LLMConfig): void {
  localStorage.setItem(LLM_CONFIG_KEY, JSON.stringify(config));
}
