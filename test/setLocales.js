import setLocales from '../src/setLocales';

describe('Custom locales', () => {
  it('does not remove default language if others added', () => {
    const locale = require('../src/locales').default;
    const initialEnglishValue = locale.en.string.email;

    const dict = {
      ro: {
        string: {
          email: 'Format email invalid',
        },
      },
    };

    setLocales(dict);

    expect(locale.ro.string.email).to.equal(dict.ro.string.email);
    expect(locale.en.string.email).to.equal(initialEnglishValue);
  });
});
