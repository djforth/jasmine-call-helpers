'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var notCaller = function notCaller(SpyManager, spy) {
  var title = spy[0];
  var call = spy.length === 3 ? spy[2] : null;
  it('should not call ' + title, function () {
    title = title.match(/\./) ? title.split('.') : title;
    var spy = SpyManager.get(title);

    if (_lodash2.default.isNull(call)) {
      expect(spy).not.toHaveBeenCalled();
    } else {
      expect(spy.calls.count()).not.toEqual(call + 1);
    }
  });
};

exports.default = function (SpyManager) {
  return function (list) {
    if (_lodash2.default.isArray(list[0])) {
      list.forEach(function (spy) {
        notCaller(SpyManager, spy);
      });
    } else {
      notCaller(SpyManager, list);
    }
  };
};

module.exports = exports['default'];