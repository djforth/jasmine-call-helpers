import _ from 'lodash';

export default (type)=>(list)=>{
  list.forEach((spy)=>{
    let title = spy[0];
    let call = (spy.length === 3) ? spy[2] : null;
    it(`should not call ${title}`, ()=>{
      title = (title.match(/\./)) ? title.split('.') : title;
      let spy;
      if (_.isArray(title)){
        spy = type.get(title[0])[title[1]];
      } else {
        spy = type.get(title);
      }
      if (_.isNull(call)){
        expect(spy).not.toHaveBeenCalled();
      } else {
        expect(spy.calls.count()).not.toEqual(call);
      }

    });
  });
};