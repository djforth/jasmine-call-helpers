import JasmineCallHelper from '../src';
import Dummy from './dummy/test';
import SpyManager from '@djforth/stubs-spy-manager';
let spies_stubs = SpyManager(Dummy);

describe('JasmineCallHelper', function(){
  let spy;
  beforeEach(()=>{
    spies_stubs.add([
      {
        spy: 'tester'
      }
      , {
        spy: 'bar'
      }
      , {
        spy: 'phil'
      }
      , {
        spy: 'foo'
      }
      , {
        spy: 'foo2.bar'
      }
      , {
        spy: 'foo2.foo'
      }
    ]).make();

    spy = spies_stubs.get('tester');
  });

  afterEach(function(){
    spies_stubs.reset();
  });

  let calls = [
    ['bar']
    , ['phil', 'bar']
  ];

  let foo = [
    ['foo', ['bar', ()=>spy]]
    , ['foo', 'bar1', 1]
    , ['foo', 'bar2', 2]
  ];

  let callHelper = JasmineCallHelper(spies_stubs);

  describe('check calls', function(){
    beforeEach(()=>{
      spies_stubs.get('bar')();
      spies_stubs.get('phil')('bar');
    });
    callHelper.add(calls);
    callHelper.checkCalls();
    callHelper.reset();
  });

  describe('check foo calls', function(){
    beforeEach(()=>{
      let foo = spies_stubs.get('foo')
      foo('bar', spy);
      foo('bar1');
      foo('bar2');
    });

    callHelper.add(foo);
    callHelper.checkCalls();
    callHelper.reset();
  });

  describe('check stubs', function(){
    beforeEach(()=>{
      spies_stubs.add([
        {
          stub: 'test_fn'
          , callbacks: 'foo'
        }
        , {
          stub: 'test1_fn'
          , callbacks: 'bar'
        }
      ]).make();

      Dummy('foo', 'bar');
    });

    let test_fn = [
      ['test_fn', 'foo']
      , ['test1_fn', 'bar']
    ];

    callHelper.add(test_fn);
    callHelper.checkCalls();
    callHelper.reset();
  });

  describe('NotCalled', function(){
    callHelper.notCalled(['phil']);
  });
});
