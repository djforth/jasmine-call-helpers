import _ from 'lodash';

const notCaller = (SpyManager, spy)=>{
  let title = spy[0];
  let call = (spy.length === 3) ? spy[2] : null;
  it(`should not call ${title}`, ()=>{
    title = (title.match(/\./)) ? title.split('.') : title;
    let spy = SpyManager.get(title);

    if (_.isNull(call)){
      expect(spy).not.toHaveBeenCalled();
    } else {
      expect(spy.calls.count()).not.toEqual(call + 1);
    }
  });
};

export default (SpyManager)=>(list)=>{
  if (_.isArray(list[0])){
    list.forEach((spy)=>{
      notCaller(SpyManager, spy);
    });
  } else {
    notCaller(SpyManager, list);
  }
};
