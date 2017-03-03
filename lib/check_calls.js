'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isFunction2 = require('lodash/isFunction');

var _isFunction3 = _interopRequireDefault(_isFunction2);

var _isPlainObject2 = require('lodash/isPlainObject');

var _isPlainObject3 = _interopRequireDefault(_isPlainObject2);

var _isArray2 = require('lodash/isArray');

var _isArray3 = _interopRequireDefault(_isArray2);

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

    test(makeTestTitle(title, count, name), function () {
      expect(spy).toHaveBeenCalled();
      if (count) {
        expect(spy).toHaveBeenCalledTimes(count);
      }

      // if (name){
      //   expect(spy.and.identity()).toEqual(name);
      // }
    });

    if (args) {
      if ((0, _isArray3.default)(args)) {
        argumentArray(getSpy, args, callNo);
      } else if ((0, _check_map2.default)(args)) {
        argumentMap(getSpy, args);
      } else {
        checkArguments(getSpy, args, callNo);
      }
    }
  });
};

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

var checkType = function checkType(arg) {
  if ((0, _isArray3.default)(arg)) return 'array';
  if ((0, _isPlainObject3.default)(arg)) return 'object';
  if ((0, _isFunction3.default)(arg)) {
    return arg.mock ? 'spy' : 'function';
  }
  if (_immutable.Map.isMap(arg)) return 'ImmmutableMap';
  if (_immutable.List.isList(arg)) return 'ImmmutableList';
  return typeof arg === 'undefined' ? 'undefined' : _typeof(arg);
};

var getArgumentType = function getArgumentType(arg) {
  switch (checkType(arg)) {
    case 'number':
      return arg;
    case 'string':
      return arg;
    case 'array':
      return arg.join(',');
    case 'object':
      return JSON.stringify(arg);
    case 'function':
      return 'a function';
    case 'spy':
      return 'a spy/mock';
    case 'ImmmutableMap':
      return JSON.stringify(arg.toObject());
    case 'ImmmutableList':
      return arg.toList().join(',');
    default:
      return 'unkown';
  }
};

var createArgMsg = function createArgMsg(arg, count) {
  var msg = 'should call with ' + getArgumentType(arg);
  if (count > 0) {
    msg += 'on call ' + count;
  }

  return msg;
};

var checkArguments = function checkArguments(getSpy, arg) {
  var count = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var argNo = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

  it(createArgMsg(arg, count), function () {
    var spy = getSpy();
    var call = spy.mock.calls[count][argNo];

    arg = (0, _isFunction3.default)(arg) ? arg() : arg;
    switch (checkType(arg)) {
      case 'array':
        expect(call).toEqual(arg);
        break;
      case 'function':
      case 'spy':
        expect(call).toBeFunction();
        break;
      case 'ImmmutableMap':
      case 'ImmmutableList':
        expect(call).equalsImmutable(arg);
        break;
      default:
        expect(call).toEqual(arg);
    }
  });
};

var argumentArray = function argumentArray(getSpy, args, callNo) {
  args.forEach(function (arg, argNo) {
    checkArguments(getSpy, arg, callNo, argNo);
  });
};

var argumentMap = function argumentMap(getSpy, args) {
  args.forEach(function (arg, count) {
    if ((0, _isArray3.default)(arg)) {
      argumentArray(getSpy, arg, count);
    } else {
      checkArguments(getSpy, arg, count);
    }
  });
};

module.exports = exports['default'];