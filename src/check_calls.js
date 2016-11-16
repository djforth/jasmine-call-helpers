import _  from 'lodash';
import {Map, List} from 'immutable';
import checkMap from './utils/check_map';

const makeTestTitle = (title, count, name)=>{
  let test_title = `${title} should have been called`;
  if (name){
    test_title += ` with spy ${name}`;
  }

  if (count){
    test_title += ` ${count} times`;
  }

  return test_title;
};

const getArgumentType = (arg)=>{
  switch (typeof arg){
    case 'number': return arg;
    case 'string': return arg;
    default:
      if (_.isArray(arg)) return arg.join(',');
      if (_.isPlainObject(arg)) return `object with ${Object.keys(arg).join(',')}`;
      if (_.isFunction(arg)) return 'function/spy';
      if (Map.isMap(arg)) return 'Immmutable map';
      if (List.isList(arg)) return 'Immmutable list';
      return 'unkown';
  }
};

const checkArguments = (getSpy, arg, count = 0)=>{
  it(`should call with argument ${getArgumentType(arg)} on call ${count}`, function(){
    let spy = getSpy();
    let calls = spy.calls.argsFor(count);
    arg = (_.isFunction(arg)) ? arg() : arg;
    expect(calls).toContain(arg);
  });
};

const argumentArray = (getSpy, args, callNo)=>{
  args.forEach((arg)=>{
    checkArguments(getSpy, arg, callNo);
  });
};

const argumentMap = (getSpy, args)=>{
  args.forEach(function(arg, count){
    if (_.isArray(arg)){
      argumentArray(getSpy, arg, count);
    } else {
      checkArguments(getSpy, arg, count);
    }
  });
};

export default function(getSpy, title, {count, name, args, callNo} = {}){
  describe(`${title}`, function(){
    let spy;
    beforeEach(function(){
      spy = getSpy();
    });

    it(makeTestTitle(title, count, name), function(){
      expect(spy).toHaveBeenCalled();
      if (count){
        expect(spy).toHaveBeenCalledTimes(count);
      }

      if (name){
        expect(spy.and.identity()).toEqual(name);
      }
    });

    if (args){
      if (_.isArray(args)){
        argumentArray(getSpy, args, callNo);
      } else if (checkMap(args)){
        argumentMap(getSpy, args);
      } else {
        checkArguments(getSpy, args, callNo);
      }
    }
  });
}
