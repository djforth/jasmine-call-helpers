'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (type) {
  return function (list) {
    list.forEach(function (spy) {
      var title = spy[0];
      var call = spy.length === 3 ? spy[2] : null;
      it('should not call ' + title, function () {
        title = title.match(/\./) ? title.split('.') : title;
        var spy = undefined;
        if (_lodash2.default.isArray(title)) {
          spy = type.get(title[0])[title[1]];
        } else {
          spy = type.get(title);
        }
        if (_lodash2.default.isNull(call)) {
          expect(spy).not.toHaveBeenCalled();
        } else {
          expect(spy.calls.count()).not.toEqual(call + 1);
        }
      });
    });
  };
};

module.exports = exports['default'];