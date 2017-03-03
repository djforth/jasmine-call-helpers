import CheckCalls from '../src/check_calls';
import Dummy from './__dummy__/test';
import SpyManager from '@djforth/stubs-spy-manager-jest';
import Immutable from 'immutable';
let spies_stubs = SpyManager(Dummy);

describe('CheckCalls', function(){
  let spy;
  beforeEach(()=>{
    spies_stubs.add([
      {
        spy: 'foo'
        , callback: 'foo'
      }
    ]).make();
    spy = spies_stubs.get('foo');
  });

  describe('Simple test', function(){
    beforeEach(()=>{
      spy();
    });
    CheckCalls(()=>spy, 'Test Spy');
  });

  describe('Simple test called twice', function(){
    beforeEach(()=>{
      spy();
      spy();
    });
    CheckCalls(()=>spy, 'Test Spy', {count: 2});
  });

  describe('Simple test check spy name', function(){
    beforeEach(()=>{
      spy();
    });
    CheckCalls(()=>spy, 'Test Spy', {name: 'foo'});
  });

  describe('Simple test check arguments', function(){
    beforeEach(()=>{
      spy('foo', 2);
    });
    CheckCalls(()=>spy, 'Test Spy', {args: ['foo', 2]});
  });

  describe('Simple test check argument of array', function(){
    beforeEach(()=>{
      spy([1, 2, 3]);
    });
    CheckCalls(()=>spy, 'Test Spy', {args: [[1, 2, 3]]});
  });

  describe('Simple test check argument of object', function(){
    beforeEach(()=>{
      spy({foo: 'bar', bar: 'foo'});
    });
    CheckCalls(()=>spy, 'Test Spy', {args: {foo: 'bar', bar: 'foo'}});
  });

  describe('Simple test check argument of Immutable Map', function(){
    let map = Immutable.Map({foo: 'bar', bar: 'foo'});
    beforeEach(()=>{
      spy(map);
    });

    CheckCalls(()=>spy, 'Test Spy', {args: map});
  });

  describe('Simple test check argument of Immutable List', function(){
    let list = Immutable.List(['bar', 'foo']);
    beforeEach(()=>{
      spy(list);
    });

    CheckCalls(()=>spy, 'Test Spy', {args: list});
  });

  describe('Simple test check arguments on second calls', function(){
    beforeEach(()=>{
      spy(2);
      spy('foo', 2);
    });
    CheckCalls(()=>spy, 'Test Spy', {args: ['foo', 2], callNo: 1});
  });

  describe('Simple test check argument of Spy', function(){
    beforeEach(()=>{
      spies_stubs.add([
        {spy: 'foo'}
      ]).make();
      spy(spies_stubs.get('foo'));
    });

    CheckCalls(()=>spy, 'Test Spy', {args: ()=>spies_stubs.get('foo')});
  });

  describe('multiple calls', function() {
    beforeEach(()=>{
      spies_stubs.add([
        {spy: 'foo'}
      ]).make();
      spy(spies_stubs.get('foo'));
      spy('foo', 'bar');
      spy(['foo', 'bar']);
      spy({foo: 'bar'});
    });

    let args = new Map();
    args.set(0, ()=>spies_stubs.get('foo'));
    args.set(1, ['foo', 'bar']);
    args.set(2, ()=>['foo', 'bar']);
    args.set(3, {foo: 'bar'});
    CheckCalls(()=>spy, 'Test Spy', {args});
  });
});
