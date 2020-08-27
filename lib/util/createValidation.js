"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.createErrorFactory = createErrorFactory;
exports.default = createValidation;

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _mapValues = _interopRequireDefault(require("lodash/mapValues"));

var _ValidationError = _interopRequireDefault(require("../ValidationError"));

var _Reference = _interopRequireDefault(require("../Reference"));

var _synchronousPromise = require("synchronous-promise");

var _get = _interopRequireDefault(require("lodash/get"));

var _languageLocale = _interopRequireDefault(require("../languageLocale"));

var formatError = _ValidationError.default.formatError;

var thenable = function thenable(p) {
  return p && typeof p.then === 'function' && typeof p.catch === 'function';
};

function runTest(testFn, ctx, value, sync) {
  var result = testFn.call(ctx, value);
  if (!sync) return Promise.resolve(result);

  if (thenable(result)) {
    throw new Error("Validation test of type: \"" + ctx.type + "\" returned a Promise during a synchronous validate. " + "This test will finish after the validate call has returned");
  }

  return _synchronousPromise.SynchronousPromise.resolve(result);
}

function resolveParams(oldParams, newParams, resolve) {
  return (0, _mapValues.default)((0, _extends2.default)({}, oldParams, newParams), resolve);
}

function createErrorFactory(_ref) {
  var value = _ref.value,
      label = _ref.label,
      resolve = _ref.resolve,
      originalValue = _ref.originalValue,
      opts = (0, _objectWithoutPropertiesLoose2.default)(_ref, ["value", "label", "resolve", "originalValue"]);
  return function createError(_temp) {
    var _ref2 = _temp === void 0 ? {} : _temp,
        _ref2$path = _ref2.path,
        path = _ref2$path === void 0 ? opts.path : _ref2$path,
        _ref2$message = _ref2.message,
        message = _ref2$message === void 0 ? opts.message : _ref2$message,
        _ref2$type = _ref2.type,
        type = _ref2$type === void 0 ? opts.name : _ref2$type,
        params = _ref2.params;

    params = (0, _extends2.default)({
      path: path,
      value: value,
      originalValue: originalValue,
      label: label
    }, resolveParams(opts.params, params, resolve));
    return (0, _extends2.default)(new _ValidationError.default(formatError(message, params), value, path, type), {
      params: params
    });
  };
}

function translate(key, lang, params) {
  var translation = (0, _get.default)((0, _languageLocale.default)(lang), key);

  if (!translation) {
    return translation;
  }

  return Object.keys(params || {}).reduce(function (prev, key) {
    return prev.split("${" + key + "}").join(params[key]);
  }, translation);
}

function getFieldTranslation(field, lang) {
  var translatedFullPath = translate("fields." + field, lang);

  if (translatedFullPath) {
    return translatedFullPath;
  }

  if (field) {
    var translatedPathTail = field.split('.').map(function (f) {
      return translate("fields." + f, lang);
    }).filter(function (f) {
      return !!f;
    }).join("->");

    if (translatedPathTail && translatedPathTail.length > 0) {
      return translatedPathTail;
    }
  }

  return field;
}

function getMessage(passedMessage, name, path, lang) {
  if (passedMessage) {
    return passedMessage;
  }

  var translateParams = {
    path: getFieldTranslation(path || "this", lang)
  };
  var messageInSpecifiedLanguage = translate(name, lang, translateParams);

  if (messageInSpecifiedLanguage) {
    return messageInSpecifiedLanguage;
  }

  var messageInDefaultLanguage = translate(name, undefined, translateParams);

  if (messageInDefaultLanguage) {
    return messageInDefaultLanguage;
  }

  var defaultMessageInSpecifiedLanguage = translate('mixed.default', lang, translateParams);

  if (defaultMessageInSpecifiedLanguage) {
    return defaultMessageInSpecifiedLanguage;
  }

  return (0, _languageLocale.default)().mixed.default;
}

function createValidation(options) {
  var name = options.name,
      message = options.message,
      test = options.test,
      params = options.params;

  function validate(_ref3) {
    var value = _ref3.value,
        path = _ref3.path,
        label = _ref3.label,
        options = _ref3.options,
        originalValue = _ref3.originalValue,
        sync = _ref3.sync,
        rest = (0, _objectWithoutPropertiesLoose2.default)(_ref3, ["value", "path", "label", "options", "originalValue", "sync"]);
    var translatedMessage = getMessage(message, name, label || path, options.lang);
    var parent = options.parent;

    var resolve = function resolve(item) {
      return _Reference.default.isRef(item) ? item.getValue({
        value: value,
        parent: parent,
        context: options.context
      }) : item;
    };

    var createError = createErrorFactory({
      message: translatedMessage,
      path: path,
      value: value,
      originalValue: originalValue,
      params: params,
      label: label,
      resolve: resolve,
      name: name
    });
    var ctx = (0, _extends2.default)({
      path: path,
      parent: parent,
      type: name,
      createError: createError,
      resolve: resolve,
      options: options
    }, rest);
    return runTest(test, ctx, value, sync).then(function (validOrError) {
      if (_ValidationError.default.isError(validOrError)) throw validOrError;else if (!validOrError) throw createError();
    });
  }

  validate.OPTIONS = options;
  return validate;
}