var _ = require('lodash');

module.exports  = function(getSpy, title, getArgs, callCount){
  describe(`${title}`, function(){
    let args, spy;
    beforeEach(function(){
      spy = getSpy();
      args = (_.isFunction(getArgs)) ? getArgs() : getArgs;
    });

    afterEach(()=>{
      spy.calls.reset();
    });

    it(`should call ${title}`, function(){
      expect(spy).toHaveBeenCalled();
      let calls = spy.calls.argsFor(callCount || 0);
      // console.log(calls, args)
      _.forEach(args, (arg, i)=>{
        if (_.isFunction(calls[i])){
          expect(arg).toEqual(jasmine.any(Function));
        } else if (_.isPlainObject(calls[i])){
          expect(_.keys(calls[i])).toEqual(_.keys(arg));
        } else {
          expect(calls[i]).toEqual(arg);
        }
      });
    });
  });
};
