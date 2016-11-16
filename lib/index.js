'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _process_list = require('./utils/process_list');

var _process_list2 = _interopRequireDefault(_process_list);

var _check_calls = require('./check_calls');

var _check_calls2 = _interopRequireDefault(_check_calls);

var _not_called = require('./not_called');

var _not_called2 = _interopRequireDefault(_not_called);

var _immutable = require('immutable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (SpyManager) {
  var processor = (0, _process_list2.default)(SpyManager);
  var _notCalled = (0, _not_called2.default)(SpyManager);
  var calls = (0, _immutable.List)();
  return {
    add: function add(list) {
      calls = processor(list, calls);
    },
    checkCalls: function checkCalls() {
      calls.forEach(function (call) {
        (0, _check_calls2.default)(call.get('spy'), call.get('title'), call.get('args'));
      });
    },
    notCalled: function notCalled(list) {
      _notCalled(list);
    },
    reset: function reset() {
      calls = (0, _immutable.List)();
    }
  };
};

module.exports = exports['default'];