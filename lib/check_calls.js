'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = function (getSpy, title) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      count = _ref.count,
      name = _ref.name,
      args = _ref.args,
      callNo = _ref.callNo;

  describe('' + title, function () {
    var spy = undefined;
    beforeEach(function () {
      spy = getSpy();
    });

    it(makeTestTitle(title, count, name), function () {
      expect(spy).toHaveBeenCalled();
      if (count) {
        expect(spy).toHaveBeenCalledTimes(count);
      }

      if (name) {
        expect(spy.and.identity()).toEqual(name);
      }
    });

    if (args) {
      if (_lodash2.default.isArray(args)) {
        argumentArray(getSpy, args, callNo);
      } else if ((0, _check_map2.default)(args)) {
        argumentMap(getSpy, args);
      } else {
        checkArguments(getSpy, args, callNo);
      }
    }
  });
};

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _immutable = require('immutable');

var _check_map = require('./utils/check_map');

var _check_map2 = _interopRequireDefault(_check_map);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var makeTestTitle = function makeTestTitle(title, count, name) {
  var test_title = title + ' should have been called';
  if (name) {
    test_title += ' with spy ' + name;
  }

  if (count) {
    test_title += ' ' + count + ' times';
  }

  return test_title;
};

var getArgumentType = function getArgumentType(arg) {
  switch (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) {
    case 'number':
      return arg;
    case 'string':
      return arg;
    default:
      if (_lodash2.default.isArray(arg)) return arg.join(',');
      if (_lodash2.default.isPlainObject(arg)) return 'object with ' + Object.keys(arg).join(',');
      if (_lodash2.default.isFunction(arg)) return 'function/spy';
      if (_immutable.Map.isMap(arg)) return 'Immmutable map';
      if (_immutable.List.isList(arg)) return 'Immmutable list';
      return 'unkown';
  }
};

var checkArguments = function checkArguments(getSpy, arg) {
  var count = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

  it('should call with argument ' + getArgumentType(arg) + ' on call ' + count, function () {
    var spy = getSpy();
    var calls = spy.calls.argsFor(count);
    arg = _lodash2.default.isFunction(arg) ? arg() : arg;
    expect(calls).toContain(arg);
  });
};

var argumentArray = function argumentArray(getSpy, args, callNo) {
  args.forEach(function (arg) {
    checkArguments(getSpy, arg, callNo);
  });
};

var argumentMap = function argumentMap(getSpy, args) {
  args.forEach(function (arg, count) {
    if (_lodash2.default.isArray(arg)) {
      argumentArray(getSpy, arg, count);
    } else {
      checkArguments(getSpy, arg, count);
    }
  });
};

module.exports = exports['default'];