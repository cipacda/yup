import locale, { defaultLanguage } from './locales';
import merge from 'lodash/merge';

export default function setLocale(custom, language = defaultLanguage) {
  locale[language] = merge(locale[language], custom);
}
