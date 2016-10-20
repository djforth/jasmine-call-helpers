var _          = require('lodash');
var checkCalls = require('./check_calls');

module.exports  = function(list){
  _.forIn(list, (v, k)=>{
    let spy, args, callCount;
    if (_.isArray(v)){
      spy  = v[0];
      args = v[1];
      callCount = v[2] || 0;
    } else if (_.isFunction(v)){
      spy = v;
    } else if (_.isPlainObject(v)){
      spy  = v.spy;
      args = v.args;
      callCount = (_.has(v, callCount)) ? v.callCount : 0;
    }

    checkCalls(spy, k, args, callCount);
  });
};
