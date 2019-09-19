import allLocales, { defaultLanguage } from './locales';

export default function(lang) {
  if (allLocales[lang]) {
    return allLocales[lang];
  }
  return allLocales[defaultLanguage];
}
