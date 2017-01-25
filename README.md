# jasmine-call-helpers

A call helper designed to work with @djforth/stubs-spy-manager

Install:

```bash
yarn -D @djforth/jasmine-call-helpers
```

## Set up

```javascript
import SpyManager from '@djforth/stubs-spy-manager';
import JasmineCallHelper from '@djforth/jasmine-call-helpers'
import MyModule from './path/to/my_module';

let spies_stubs = SpyManager(MyModule);
let callHelper = JasmineCallHelper(spies_stubs);

describe('My Tests', ()=>{
  beforeEach(()=>{
    spies_stubs.add([
      {
        stub: 'bar'
      }
      , {
        stub: 'foo'
      }
    ]).make();

    MyModule(); //Assuming foo and bar are called
  });

  afterEach(()=>{
    spies_stubs.reset();
  });

  let calls = [
    ['foo', ()=>['some attribute']]
    , ['bar', ()=>['some attribute']]
  ];
  callHelper.add(calls);
  callHelper.checkCalls();
  callHelper.reset();
})
```