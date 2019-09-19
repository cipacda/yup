import setLocale from './setLocale';

export default function setLocales(custom) {
  Object.keys(custom).forEach(language => {
    setLocale(custom[language], language);
  });
}
