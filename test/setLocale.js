import { setLocale } from '../src';

describe('Custom locale', () => {
  it('should have default locale set to english', () => {
    const locale = require('../src/locales').default;
    expect(Object.keys(locale).length).to.equal(1);
    expect(Object.keys(locale)[0]).to.equal('en');

    const defaultLanguageLocale = locale.en;
    expect(defaultLanguageLocale.string.email).to.equal(
      '${path} must be a valid email',
    );
  });

  it('should set a new locale for default language', () => {
    const locale = require('../src/locales').default;
    const dict = {
      string: {
        email: 'Invalid email',
      },
    };

    setLocale(dict);

    expect(locale.en.string.email).to.equal(dict.string.email);
  });

  it('should set a new locale for passed language', () => {
    const locale = require('../src/locales').default;
    const previousDefaultLanguageStringEmailValue = locale.en.string.email;
    const dict = {
      string: {
        email: 'Formatul email-ului este invalid',
      },
    };

    setLocale(dict, 'ro');

    expect(locale.ro.string.email).to.equal(dict.string.email);
    expect(locale.en.string.email).to.equal(
      previousDefaultLanguageStringEmailValue,
    );
  });

  it('should update the main locale', () => {
    const locale = require('../src/locales').default;
    expect(locale.en.string.email).to.equal('Invalid email');
  });
});
