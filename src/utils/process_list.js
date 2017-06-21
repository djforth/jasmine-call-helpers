import _ from 'lodash';
import Immutable, {List} from 'immutable';
import checkMap from './check_map';

const getTitle = (spyName)=>{
  if (typeof spyName === 'string') return spyName;
  if (spyName.hasOwnProperty('stub')) return `${spyName.stub}-stub`;
  if (spyName.hasOwnProperty('spy')) return `${spyName.spy}-spy`;
  return null;
};

const spyType = (spyName)=>{
  if (typeof spyName === 'string') return 1;
  if (_.isPlainObject(spyName)){
    if (spyName.hasOwnProperty('stub')) return 2;
    if (spyName.hasOwnProperty('spy')) return 3;
  }

  return 0;
};

const makeSpyCall = (SpyManager)=>(spyName)=>{
  switch (spyType(spyName)){
    case 1: return ()=>SpyManager.get(spyName);
    case 2: return ()=>SpyManager.get(spyName.stub, true);
    case 3: return ()=>SpyManager.get(spyName.spy, false);
    default:
      return null;
  }
};

const hasArgs = (item)=>{
  let details = item[0];
  if (item.length > 1) return true;
  if (_.isPlainObject(details)){
    return details.hasOwnProperty('name') ||
      details.hasOwnProperty('count');
  }
  return false;
};

const makeArgs = (item)=>{
  let obj = {};

  if (item.length > 1){
    obj.args = item[1];
  }

  if (_.isPlainObject(item[0])){
    let details = item[0];
    if (details.hasOwnProperty('name')){
      obj.name = details.name;
    }

    if (details.hasOwnProperty('count')){
      obj.count = details.count;
    }
  }

  return obj;
};

const makeItem = (title, spy, data)=>{
  let item = Immutable.Map({
    spy
    , title
  });

  if (hasArgs(data)){
    item = item.set('args', makeArgs(data));
  }

  return item;
};

const checkPresent = (list, title, item)=>{
  let matched = list.find((li)=>li.get('title') === title
  );

  if (matched){
    return matched;
  }
  return null;
};

const mergeData = (item, data)=>{
  let old_data = item.get('args');
  if (!old_data || !old_data.hasOwnProperty('args')) return item;
  let args = old_data.args;

  args = (checkMap(args)) ? args : new Map([[0, args]]);

  if (data.length > 1){
    let key = (data[2]) ? data[2] : args.size;

    args.set(key, data[1]);
  }
  let merge = Object.assign(old_data, {args});
  return item.set('args', merge);
};

export default (SpyManager)=>(data, list = List())=>{
  let get_spy = makeSpyCall(SpyManager);
  return data.reduce((prev, curr)=>{
    let title = getTitle(curr[0]);
    let spy = get_spy(curr[0]);
    if (title === null || spy === null) return prev;
    let match = checkPresent(prev, title, curr);

    if (match){
      return prev.set(prev.indexOf(match), mergeData(match, curr));
    }

    let item = makeItem(title, spy, curr);
    return prev.push(item);
  }, list);
};
