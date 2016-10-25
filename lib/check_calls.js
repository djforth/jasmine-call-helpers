'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (getSpy, title, getArgs, callCount) {
  describe('' + title, function () {
    var args = undefined,
        spy = undefined;
    beforeEach(function () {
      spy = getSpy();
      args = _.isFunction(getArgs) ? getArgs() : getArgs;
    });

    afterEach(function () {
      spy.calls.reset();
    });

    it('should call ' + title, function () {
      expect(spy).toHaveBeenCalled();
      var calls = spy.calls.argsFor(callCount || 0);
      // console.log(calls, args)
      _.forEach(args, function (arg, i) {
        if (_.isFunction(calls[i])) {
          expect(arg).toEqual(jasmine.any(Function));
        } else if (_.isPlainObject(calls[i])) {
          expect(_.keys(calls[i])).toEqual(_.keys(arg));
        } else {
          expect(calls[i]).toEqual(arg);
        }
      });
    });
  });
};

var _ = require('lodash');

;
module.exports = exports['default'];