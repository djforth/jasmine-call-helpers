'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _check_map = require('./check_map');

var _check_map2 = _interopRequireDefault(_check_map);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getTitle = function getTitle(spyName) {
  if (typeof spyName === 'string') return spyName;
  if (spyName.hasOwnProperty('stub')) return spyName.stub + '-stub';
  if (spyName.hasOwnProperty('spy')) return spyName.spy + '-spy';
  return null;
};

var spyType = function spyType(spyName) {
  if (typeof spyName === 'string') return 1;
  if (_lodash2.default.isPlainObject(spyName)) {
    if (spyName.hasOwnProperty('stub')) return 2;
    if (spyName.hasOwnProperty('spy')) return 3;
  }

  return 0;
};

var makeSpyCall = function makeSpyCall(SpyManager) {
  return function (spyName) {
    var spy = undefined;
    switch (spyType(spyName)) {
      case 1:
        return function () {
          return SpyManager.get(spyName);
        };
      case 2:
        return function () {
          return SpyManager.get(spyName.stub, true);
        };
      case 3:
        return function () {
          return SpyManager.get(spyName.spy, false);
        };
      default:
        return null;
    }
  };
};

var hasArgs = function hasArgs(item) {
  var details = item[0];
  if (item.length > 1) return true;
  if (_lodash2.default.isPlainObject(details)) {
    return details.hasOwnProperty('name') || details.hasOwnProperty('count');
  }
  return false;
};

var makeArgs = function makeArgs(item) {
  var obj = {};

  if (item.length > 1) {
    obj.args = item[1];
  }

  if (_lodash2.default.isPlainObject(item[0])) {
    var details = item[0];
    if (details.hasOwnProperty('name')) {
      obj.name = details.name;
    }

    if (details.hasOwnProperty('count')) {
      obj.count = details.count;
    }
  }

  return obj;
};

var makeItem = function makeItem(title, spy, data) {
  var item = _immutable2.default.Map({
    spy: spy,
    title: title
  });

  if (hasArgs(data)) {
    item = item.set('args', makeArgs(data));
  }

  return item;
};

var checkPresent = function checkPresent(list, title, item) {
  var matched = list.find(function (li) {
    return li.get('title') === title;
  });

  if (matched) {
    return matched;
  }
  return null;
};

var mergeData = function mergeData(item, data) {
  var old_data = item.get('args');
  if (!old_data || !old_data.hasOwnProperty('args')) return item;
  var args = old_data.args;

  args = (0, _check_map2.default)(args) ? args : new Map([[0, args]]);

  if (data.length > 1) {
    var key = data[2] ? data[2] : args.size;

    args.set(key, data[1]);
  }
  var merge = Object.assign(old_data, { args: args });
  return item.set('args', merge);
};

exports.default = function (SpyManager) {
  return function (data) {
    var list = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : (0, _immutable.List)();

    var get_spy = makeSpyCall(SpyManager);
    return data.reduce(function (prev, curr) {
      var title = getTitle(curr[0]);
      var spy = get_spy(curr[0]);
      if (title === null || spy === null) return prev;
      var match = checkPresent(prev, title, curr);

      if (match) {
        return prev.set(prev.indexOf(match), mergeData(match, curr));
      }

      var item = makeItem(title, spy, curr);
      return prev.push(item);
    }, list);
  };
};

module.exports = exports['default'];