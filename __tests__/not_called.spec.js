import NotCalled from 'not_called';
import Dummy from './__dummy__/test';
import SpyManager from '@djforth/stubs-spy-manager-jest';
let spies_stubs = SpyManager(Dummy);

let notCalled = NotCalled(spies_stubs);

describe('Checks if spy not called', function(){
  beforeEach(()=>{
    spies_stubs.add([
      {
        spy: 'tester'
      }
      , {
        spy: 'bar'
      }
    ]).make();
  });

  afterEach(function(){
    spies_stubs.reset();
  });

  describe('checks tester not called', function(){
    notCalled([
      ['tester']
      , ['bar']
    ]);
  });

  describe('checks tester not called twice', function(){
    beforeEach(()=>{
      spies_stubs.get('tester')();
    });

    notCalled([
      ['tester', [], 1]
    ]);
  });
});