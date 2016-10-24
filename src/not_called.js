import _ from 'lodash';

module.exports = (type)=>(list)=>{
  list.forEach((spy)=>{
    let title = spy[0];
    it(`should not call ${title}`, function() {
      title = (title.match(/\./)) ? title.split('.') : title;
      let spy;
      if (_.isArray(title)){
        spy = type.get(title[0])[title[1]];
      } else {
        spy = type.get(title);
      }

      expect(spy).not.toHaveBeenCalled();
    });
  });
};