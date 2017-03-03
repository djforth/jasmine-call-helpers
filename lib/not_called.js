'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isArray2 = require('lodash/isArray');

var _isArray3 = _interopRequireDefault(_isArray2);

var _isNull2 = require('lodash/isNull');

var _isNull3 = _interopRequireDefault(_isNull2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var notCaller = function notCaller(SpyManager, spy) {
  var title = spy[0];
  var call = spy.length === 3 ? spy[2] : null;
  it('should not call ' + title, function () {
    title = title.match(/\./) ? title.split('.') : title;
    var spy = SpyManager.get(title);

    if ((0, _isNull3.default)(call)) {
      expect(spy).not.toHaveBeenCalled();
    } else {
      expect(spy.mock.calls.length).not.toEqual(call + 1);
    }
  });
};

exports.default = function (SpyManager) {
  return function (list) {
    if ((0, _isArray3.default)(list[0])) {
      list.forEach(function (spy) {
        notCaller(SpyManager, spy);
      });
    } else {
      notCaller(SpyManager, list);
    }
  };
};

module.exports = exports['default'];