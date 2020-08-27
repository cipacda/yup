"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = exports.defaultLanguage = void 0;

var _defaultLocale = _interopRequireDefault(require("./defaultLocale"));

var _defaultLanguage;

var defaultLanguage = 'en';
exports.defaultLanguage = defaultLanguage;

var _default = (_defaultLanguage = {}, _defaultLanguage[defaultLanguage] = _defaultLocale.default, _defaultLanguage);

exports.default = _default;