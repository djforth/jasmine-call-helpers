import _ from 'lodash';

const makeCall = (type, call_array)=>{
  return call_array.map((c, i)=>{
    if (i > 0) return c;
    c = (c.match(/\./)) ? c.split('.') : c;
    if (_.isArray(c)){
      // console.log(c)
      return ()=>type.get(c[0])[c[1]];
    }

    return ()=>type.get(c);
  });
};

const makeTitle = (call_array)=>{
  let title = call_array[0];
  if (_.isArray(title)){
    title = title.join('.');
  }

  if (call_array.length > 2){
    title += call_array[2];
  }

  return title;
};

export default (type)=>(list, calls = {})=>{
  return list.reduce((prev, curr)=>{
    let title = makeTitle(curr);
    let obj = {};

    obj[title] = makeCall(type, curr);

    return Object.assign(prev, obj);
  }, calls);
};
