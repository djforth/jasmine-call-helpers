
import ProcessList from './utils/process_list';
import CheckCalls from './check_calls';
import NotCalled from './not_called';

import {List} from 'immutable';

export default (SpyManager)=>{
  let processor = ProcessList(SpyManager);
  let notCalled = NotCalled(SpyManager);
  let calls = List();
  return {
    add: (list)=>{
      calls = processor(list, calls);
    }
    , checkCalls: ()=>{
      calls.forEach((call)=>{
        CheckCalls(call.get('spy'), call.get('title'), call.get('args'));
      });
    }
    , notCalled: (list)=>{
      notCalled(list);
    }
    , reset: ()=>{
      calls = List();
    }
  };
};
