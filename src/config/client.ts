import { QueryClient } from '@tanstack/react-query';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import EventEmitter from 'eventemitter3';
import { openDatabaseSync } from 'expo-sqlite';
import * as schema from '../database/schema';
import AIService from '../service/ai/AIService';
import AudioService from '../service/audio/AudioService';
import LLMService from '../service/llm/LLMService';
import type { Events } from '../type/struct';
import { DATABASE_NAME } from './constant';

export const eventEmitter = new EventEmitter<Events>();

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

export const expoDatabase = openDatabaseSync(DATABASE_NAME, { enableChangeListener: true });
export const db = drizzle(expoDatabase, { schema });

export const audioService = new AudioService();

export const aiService = new AIService();

export const llmService = new LLMService();
