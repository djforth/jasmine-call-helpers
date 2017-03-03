import _ , {
  isArray
  , isPlainObject
  , isFunction
} from 'lodash';

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

const checkType = (arg)=>{
  if (isArray(arg)) return 'array';
  if (isPlainObject(arg)) return 'object';
  if (isFunction(arg)) {
    return (arg.mock) ? 'spy' : 'function';
  }
  if (Map.isMap(arg)) return 'ImmmutableMap';
  if (List.isList(arg)) return 'ImmmutableList';
  return typeof arg;
}

const getArgumentType = (arg)=>{
  switch (checkType(arg)){
    case 'number': return arg;
    case 'string': return arg;
    case 'array': return arg.join(',');
    case 'object': return JSON.stringify(arg);
    case 'function': return 'a function'
    case 'spy': return 'a spy/mock'
    case 'ImmmutableMap': return JSON.stringify(arg.toObject());
    case 'ImmmutableList': return arg.toList().join(',');
    default:
      return 'unkown';
  }
};

const createArgMsg = (arg, count)=>{
  let msg = `should call with ${getArgumentType(arg)}`
  if (count > 0) {
    msg += `on call ${count}`;
  }

  return msg;
};

const checkArguments = (getSpy, arg, count = 0, argNo = 0)=>{
  it(createArgMsg(arg, count), function(){
    let spy = getSpy();
    let call = spy.mock.calls[count][argNo];

    arg = (isFunction(arg)) ? arg() : arg;
    switch (checkType(arg)){
      case 'array':
        expect(call).toEqual(arg);
        break;
      case 'function':
      case 'spy':
        expect(call).toBeFunction();
        break;
      case 'ImmmutableMap':
      case 'ImmmutableList':
        expect(call).equalsImmutable(arg)
        break;
      default:
        expect(call).toEqual(arg);
    }
  });
};

const argumentArray = (getSpy, args, callNo)=>{
  args.forEach((arg, argNo)=>{
    checkArguments(getSpy, arg, callNo, argNo);
  });
};

const argumentMap = (getSpy, args)=>{
  args.forEach(function(arg, count){
    if (isArray(arg)){
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

    test(makeTestTitle(title, count, name), function(){
      expect(spy).toHaveBeenCalled();
      if (count){
        expect(spy).toHaveBeenCalledTimes(count);
      }


      // if (name){
      //   expect(spy.and.identity()).toEqual(name);
      // }
    });

    if (args){
      if (isArray(args)){
        argumentArray(getSpy, args, callNo);
      } else if (checkMap(args)){
        argumentMap(getSpy, args);
      } else {
        checkArguments(getSpy, args, callNo);
      }
    }
  });
}
