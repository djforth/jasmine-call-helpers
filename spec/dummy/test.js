const test_fn = ()=>'Testing 123';
const test1_fn = ()=>'Testing 345';
const test2_fn = ()=>()=>'Testing 678';

const test3_fn = {
  foo: ()=>'Testing 9, 10'
  , bar: ()=>'Testing 11, 12'
};

export default (arg1, arg2)=>{
  return test_fn(arg1) + test1_fn(arg2);
};

export const Testing = ()=>test2_fn;

export const Testing2 = ()=>test3_fn;