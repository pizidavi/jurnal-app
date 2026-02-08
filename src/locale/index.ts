import { getLocales } from 'expo-localization';
import i18n, { type CustomTypeOptions, type ParseKeys } from 'i18next';
import { initReactI18next } from 'react-i18next';
import { LANGUAGE } from '../type/enum';
import { appLog } from '../util/logger';
import english from './en.json';
import italian from './it.json';

const resources = {
  [LANGUAGE.EN]: english,
  [LANGUAGE.IT]: italian,
} as const;

void i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  resources,
  lng: LANGUAGE.EN,
  keySeparator: false,
  interpolation: {
    escapeValue: false,
  },
  showSupportNotice: false,
});

const isLanguageAvailable = (languageString: string) =>
  Object.values(LANGUAGE).includes(languageString as LANGUAGE);

const locale = getLocales()[0];
const languageCode = locale.languageCode ?? locale.languageTag.split('-')[0];

if (isLanguageAvailable(languageCode) && languageCode !== i18n.language) {
  appLog.debug(`Updated language from ${i18n.language} to ${languageCode}`);
  void i18n.changeLanguage(languageCode).catch(e => appLog.error('Error changing language', e));
}

declare module 'i18next' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface CustomTypeOptions {
    resources: typeof resources;
    keySeparator: ':';
  }
}

export type Dictionary = ParseKeys<keyof CustomTypeOptions['resources']> | TemplateStringsArray;

export default i18n;
