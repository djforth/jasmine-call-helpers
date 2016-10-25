'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var makeCall = function makeCall(type, call_array) {
  return call_array.map(function (c, i) {
    if (i > 0) return c;
    c = c.match(/\./) ? c.split('.') : c;
    if (_lodash2.default.isArray(c)) {
      // console.log(c)
      return function () {
        return type.get(c[0])[c[1]];
      };
    }

    return function () {
      return type.get(c);
    };
  });
};

var makeTitle = function makeTitle(call_array) {
  var title = call_array[0];
  if (_lodash2.default.isArray(title)) {
    title = title.join('.');
  }

  if (call_array.length > 2) {
    title += call_array[2];
  }

  return title;
};

exports.default = function (type) {
  return function (list) {
    var calls = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    return list.reduce(function (prev, curr) {
      var title = makeTitle(curr);
      var obj = {};

      obj[title] = makeCall(type, curr);

      return Object.assign(prev, obj);
    }, calls);
  };
};

module.exports = exports['default'];