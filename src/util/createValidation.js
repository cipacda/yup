import mapValues from 'lodash/mapValues';
import ValidationError from '../ValidationError';
import Ref from '../Reference';
import { SynchronousPromise } from 'synchronous-promise';
import get from 'lodash/get';
import languageLocale from '../languageLocale';

let formatError = ValidationError.formatError;

let thenable = p =>
  p && typeof p.then === 'function' && typeof p.catch === 'function';

function runTest(testFn, ctx, value, sync) {
  let result = testFn.call(ctx, value);
  if (!sync) return Promise.resolve(result);

  if (thenable(result)) {
    throw new Error(
      `Validation test of type: "${
        ctx.type
      }" returned a Promise during a synchronous validate. ` +
        `This test will finish after the validate call has returned`,
    );
  }
  return SynchronousPromise.resolve(result);
}

function resolveParams(oldParams, newParams, resolve) {
  return mapValues({ ...oldParams, ...newParams }, resolve);
}

export function createErrorFactory({
  value,
  label,
  resolve,
  originalValue,
  ...opts
}) {
  return function createError({
    path = opts.path,
    message = opts.message,
    type = opts.name,
    params,
  } = {}) {
    params = {
      path,
      value,
      originalValue,
      label,
      ...resolveParams(opts.params, params, resolve),
    };

    return Object.assign(
      new ValidationError(formatError(message, params), value, path, type),
      { params },
    );
  };
}

function translate(key, lang, params) {
  const translation = get(languageLocale(lang), key);
  if (!translation) {
    return translation;
  }
  return Object.keys(params || {}).reduce(
    (prev, key) => prev.split(`\${${key}}`).join(params[key]),
    translation,
  );
}

function getFieldTranslation(field, lang) {
  if (!field || field.length === 0) {
    return field;
  }

  const translatedFullPath = translate(`fields.${field}`, lang);
  if (translatedFullPath) {
    return translatedFullPath;
  }

  if (field) {
    const [head, ...tail] = field.split('.');
    if (tail.length > 0) {
      const tailString = tail.join(".");
      const headTranslation = getFieldTranslation(head);
      const tailTranslation = getFieldTranslation(tailString);

      if (headTranslation !== head && tailTranslation !== tailString) {
        const translation = headTranslation !== head && [headTranslation, tailTranslation].filter((t) => !!t).join("->");
        if (translation || translation.length > 0) {
          return translation;
        }
      }
    }
  }

  return field;
}

function getMessage(passedMessage, name, path, lang) {
  if (passedMessage) {
    return passedMessage;
  }

  const translateParams = { path: getFieldTranslation(path || "this", lang) };

  const messageInSpecifiedLanguage = translate(name, lang, translateParams);
  if (messageInSpecifiedLanguage) {
    return messageInSpecifiedLanguage;
  }

  const messageInDefaultLanguage = translate(name, undefined, translateParams);
  if (messageInDefaultLanguage) {
    return messageInDefaultLanguage;
  }

  const defaultMessageInSpecifiedLanguage = translate(
    'mixed.default',
    lang,
    translateParams,
  );

  if (defaultMessageInSpecifiedLanguage) {
    return defaultMessageInSpecifiedLanguage;
  }

  return languageLocale().mixed.default;
}

export default function createValidation(options) {
  let { name, message, test, params } = options;

  function validate({
    value,
    path,
    label,
    options,
    originalValue,
    sync,
    ...rest
  }) {
    let translatedMessage = getMessage(message, name, label || path, options.lang);
    let parent = options.parent;
    let resolve = item =>
      Ref.isRef(item)
        ? item.getValue({ value, parent, context: options.context })
        : item;

    let createError = createErrorFactory({
      message: translatedMessage,
      path,
      value,
      originalValue,
      params,
      label,
      resolve,
      name,
    });

    let ctx = {
      path,
      parent,
      type: name,
      createError,
      resolve,
      options,
      ...rest,
    };

    return runTest(test, ctx, value, sync).then(validOrError => {
      if (ValidationError.isError(validOrError)) throw validOrError;
      else if (!validOrError) throw createError();
    });
  }

  validate.OPTIONS = options;

  return validate;
}
