import { chat } from '@tanstack/ai';
import { createOpenaiChat } from '@tanstack/ai-openai';
import { fetch } from 'expo/fetch';
import { getLLMConfig } from '../../store/llm-config';
import { llmLog } from '../../util/logger';
import { buildPrompt } from '../../util/prompt';

class LLMService {
  public async enrichTranscription(text: string): Promise<string> {
    const config = getLLMConfig();
    if (!config) throw new Error('LLM configuration not found');

    const adapter = createOpenaiChat('openai/gpt-5-mini' as any, config.apiKey, {
      fetch: fetch as any,
      baseURL: config.baseURL,
    });

    llmLog.debug('Enriching transcription');
    const enrichedText: string = await chat({
      adapter,
      systemPrompts: [buildPrompt()],
      messages: [
        {
          role: 'user',
          content: text,
        },
      ],
      stream: false,
    });
    if (enrichedText.length < 5 || enrichedText.trim() === 'No content')
      throw new Error('Failed to enrich transcription');

    llmLog.debug('Enrichment successful', {
      originalLength: text.length,
      enrichedLength: enrichedText.length,
    });

    return enrichedText;
  }
}

export default LLMService;
