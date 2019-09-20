'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

var _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard');

exports.__esModule = true;
exports.default = setLocale;

var _locales = _interopRequireWildcard(require('./locales'));

var _merge = _interopRequireDefault(require('lodash/merge'));

function setLocale(custom, language) {
  if (language === void 0) {
    language = _locales.defaultLanguage;
  }

  _locales.default[language] = (0, _merge.default)(
    _locales.default[language],
    custom,
  );
}

module.exports = exports['default'];
