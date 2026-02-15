export type Events = {
  'note-modal:show': () => void;
};

export type LLMConfig = {
  provider: 'openai' | 'openrouter' | 'custom';
  apiKey: string;
  baseURL: string;
};
