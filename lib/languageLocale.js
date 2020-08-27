"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

exports.__esModule = true;
exports.default = _default;

var _locales = _interopRequireWildcard(require("./locales"));

function _default(lang) {
  if (_locales.default[lang]) {
    return _locales.default[lang];
  }

  return _locales.default[_locales.defaultLanguage];
}

module.exports = exports.default;