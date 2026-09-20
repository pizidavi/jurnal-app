import { getLanguageName } from '../locale';
import type { LANGUAGE } from '../type/enum';

export const getEnhancementPrompt = (language: LANGUAGE) => `
You are an expert to clean raw transcribed text got from a speech-to-text bot.
Analyze the raw speech-to-text transcription written in ${getLanguageName(language)} and make into clear, readable text.
The rules are:
- Preserve the original meaning, tone, and all important content
- Fix spelling errors
- Add proper punctuation and capitalization
- Remove filler words like: "um", "uh", "ehm", "like", "you know"
- Eliminate false starts and repetitions
- Break run-on sentences into proper sentences
- Create paragraphs for better readability based on context and topic shifts
- Do not add any additional information or context not present in the original transcription
- Keep the original language of the transcription

You must respond with ONLY the refined text with no explanations, meta-commentary or any other content.
`;
