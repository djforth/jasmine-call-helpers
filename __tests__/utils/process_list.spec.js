import Dummy from '../__dummy__/test';
import SpyManager from '@djforth/stubs-spy-manager-jest';
import Immutable, {List} from 'immutable';
import _ from 'lodash';
let spies_stubs = SpyManager(Dummy);

import ProcessList from '../../src/utils/process_list';

describe('ProcessList', function(){
  let spy;
  beforeEach(() => {
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
      , {
        stub: 'test_fn'
      }
      , {
        spy: 'test_fn'
      }
    ]).make();

    spy = spies_stubs.get('tester');
  });

  let calls = [
    ['bar']
    , ['phil', 'bar']
    , ['foo', ['bar', ()=>spy]]
    , ['foo', 'bar', 1]
    , ['foo', 'bar', 2]
    , ['foo2.bar', ['foo', 'bar']]
    , ['foo2.foo', ['foo', 'bar']]
    , [{stub: 'test_fn', name: 'test_fn-stub'}, 'bar']
    , [{spy: 'test_fn', name: 'test_fn-spy', count: 2}]
  ];

  let list = ProcessList(spies_stubs)(calls);

  it('should return an immutable list of 7', function(){
    expect(list).toBeImmutableList();
    expect(list.size).toEqual(7);
  });

  it('should all contain title', function(){
    list.forEach((item)=>{
      expect(item).hasImmutableKey('title');
      expect(typeof item.get('title')).toEqual('string');
    });
  });

  it('should all contain spy', function(){
    list.forEach((item)=>{
      expect(item).hasImmutableKey('spy');
      let spy = item.get('spy');
      expect(item.get('spy')).toBeFunction();
      spy = spy();
      expect(spy.mock).toBeTruthy();
    });
  });

  it('\'phil\' should have args', function(){
    let item = list.get(1);
    expect(item.get('title')).toEqual('phil');
    expect(item).hasImmutableKey('args');
    expect(item.get('args')).toEqual({args: 'bar'});
  });

  it('\'foo\' should have args', function(){
    let item = list.get(2);
    expect(item.get('title')).toEqual('foo');
    expect(item).hasImmutableKey('args');
    let args = item.get('args').args;
    let mapIter = args.values();
    expect(args.size).toEqual(3);
    expect(args).hasImmutableKey(0);
    expect(args).hasImmutableKey(1);
    expect(args).hasImmutableKey(2);
    expect(mapIter.next().value).toContain('bar')
    expect(mapIter.next().value).toEqual('bar');
    expect(mapIter.next().value).toEqual('bar');
  });

  it('\'foo2.bar\' should be in list', function(){
    let item = list.get(3);
    expect(item.get('title')).toEqual('foo2.bar');
    expect(item).hasImmutableKey('args');
    expect(item.get('args')).toEqual({args: ['foo', 'bar']});
  });

  it('\'foo2.foo\' should be in list', function(){
    let item = list.get(4);
    expect(item.get('title')).toEqual('foo2.foo');
    expect(item).hasImmutableKey('args');
    expect(item.get('args')).toEqual({args: ['foo', 'bar']});
  });

  it('\'test_fn\' stub should be in list', function(){
    let item = list.get(5);
    expect(item.get('title')).toEqual('test_fn-stub');
    expect(item).hasImmutableKey('args');
    expect(item.get('args').args).toEqual('bar');
  });

  it('\'test_fn\' spy should be in list', function(){
    let item = list.get(6);
    expect(item.get('title')).toEqual('test_fn-spy');
    expect(item).hasImmutableKey('args');
    // console.log(item.get('args'))
    // expect(item.get('args').args).toUndefined()
  });
});