'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

exports.__esModule = true;
exports.default = NumberSchema;

var _inherits = _interopRequireDefault(require('./util/inherits'));

var _mixed = _interopRequireDefault(require('./mixed'));

var _isAbsent = _interopRequireDefault(require('./util/isAbsent'));

var isNaN = function isNaN(value) {
  return value != +value;
};

function NumberSchema() {
  var _this = this;

  if (!(this instanceof NumberSchema)) return new NumberSchema();

  _mixed.default.call(this, {
    type: 'number',
  });

  this.withMutation(function() {
    _this.transform(function(value) {
      var parsed = value;

      if (typeof parsed === 'string') {
        parsed = parsed.replace(/\s/g, '');
        if (parsed === '') return NaN; // don't use parseFloat to avoid positives on alpha-numeric strings

        parsed = +parsed;
      }

      if (this.isType(parsed)) return parsed;
      return parseFloat(parsed);
    });
  });
}

(0, _inherits.default)(NumberSchema, _mixed.default, {
  _typeCheck: function _typeCheck(value) {
    if (value instanceof Number) value = value.valueOf();
    return typeof value === 'number' && !isNaN(value);
  },
  min: function min(_min, message) {
    return this.test({
      message: message,
      name: 'number.min',
      exclusive: true,
      params: {
        min: _min,
      },
      test: function test(value) {
        return (0, _isAbsent.default)(value) || value >= this.resolve(_min);
      },
    });
  },
  max: function max(_max, message) {
    return this.test({
      message: message,
      name: 'number.max',
      exclusive: true,
      params: {
        max: _max,
      },
      test: function test(value) {
        return (0, _isAbsent.default)(value) || value <= this.resolve(_max);
      },
    });
  },
  lessThan: function lessThan(less, message, name) {
    if (name === void 0) {
      name = 'number.lessThan';
    }

    return this.test({
      message: message,
      name: name,
      exclusive: true,
      params: {
        less: less,
      },
      test: function test(value) {
        return (0, _isAbsent.default)(value) || value < this.resolve(less);
      },
    });
  },
  moreThan: function moreThan(more, message, name) {
    if (name === void 0) {
      name = 'number.moreThan';
    }

    return this.test({
      message: message,
      name: name,
      exclusive: true,
      params: {
        more: more,
      },
      test: function test(value) {
        return (0, _isAbsent.default)(value) || value > this.resolve(more);
      },
    });
  },
  positive: function positive(msg) {
    return this.moreThan(0, msg, 'number.positive');
  },
  negative: function negative(msg) {
    return this.lessThan(0, msg, 'number.negative');
  },
  integer: function integer(message) {
    return this.test({
      name: 'number.integer',
      message: message,
      test: function test(val) {
        return (0, _isAbsent.default)(val) || Number.isInteger(val);
      },
    });
  },
  truncate: function truncate() {
    return this.transform(function(value) {
      return !(0, _isAbsent.default)(value) ? value | 0 : value;
    });
  },
  round: function round(method) {
    var avail = ['ceil', 'floor', 'round', 'trunc'];
    method = (method && method.toLowerCase()) || 'round'; // this exists for symemtry with the new Math.trunc

    if (method === 'trunc') return this.truncate();
    if (avail.indexOf(method.toLowerCase()) === -1)
      throw new TypeError(
        'Only valid options for round() are: ' + avail.join(', '),
      );
    return this.transform(function(value) {
      return !(0, _isAbsent.default)(value) ? Math[method](value) : value;
    });
  },
});
module.exports = exports['default'];
