"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = setLocales;

var _setLocale = _interopRequireDefault(require("./setLocale"));

function setLocales(custom) {
  Object.keys(custom).forEach(function (language) {
    (0, _setLocale.default)(custom[language], language);
  });
}

module.exports = exports.default;