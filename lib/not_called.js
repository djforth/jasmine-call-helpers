'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (type) {
  return function (list) {
    list.forEach(function (spy) {
      var title = spy[0];
      it('should not call ' + title, function () {
        title = title.match(/\./) ? title.split('.') : title;
        var spy = undefined;
        if (_lodash2.default.isArray(title)) {
          spy = type.get(title[0])[title[1]];
        } else {
          spy = type.get(title);
        }

        expect(spy).not.toHaveBeenCalled();
      });
    });
  };
};