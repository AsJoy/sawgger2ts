'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatPaths = exports.formatType = exports.getPathdeep = exports.formatService = exports.dateFormat = exports.getCommentForApi = exports.getApiByTag = undefined;

var _util = require('./util');

var _constants = require('./constants');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; } /**
                                                                                                                                                                                                                   * Created by yuanqiangniu on 2018/8/31.
                                                                                                                                                                                                                   */


var nameId = (0, _util.namesFactory)('path');

/**
 * 根据tag获取api
 * @param json
 * @param tag
 */
var getApiByTag = exports.getApiByTag = function getApiByTag(json, tag) {
  var paths = json.paths;
  var Api = {};
  Object.keys(paths).forEach(function (api) {
    Object.keys(paths[api]).forEach(function (method) {
      if (paths[api][method].tags.indexOf(tag) >= 0) {
        if (Api[api]) {
          Api[api][method] = paths[api][method];
        } else {
          Api[api] = _defineProperty({}, method, paths[api][method]);
        }
      }
    });
  });
  return Api;
};
/**
 * 获取api数据
 * @param paths
 * @returns {{path: string, comment: Array, last: (*|void)}[]}
 */
var getCommentForApi = exports.getCommentForApi = function getCommentForApi(paths) {
  var res = Object.keys(paths);
  var getComment = function getComment(it) {
    var res = [];
    if (Object.keys(it).length > 1) {
      Object.keys(it).forEach(function (method) {
        res.push(method + ':' + it[method].summary);
      });
      return res;
    }
    Object.keys(it).forEach(function (method) {
      res.push('' + it[method].summary);
    });
    return res;
  };
  var getLast = function getLast(path) {
    if (/\/([a-zA-Z0-9\-_]*)$/.test(path)) {
      return nameId(RegExp.$1);
    }
  };
  res = res.map(function (it) {
    return {
      path: it,
      comment: getComment(paths[it]),
      last: getLast(it)
    };
  });
  return res;
};
// console.log(getApiByTag(require('../../temp/api'), 'ops-activity-controller'))
/**
 * 时间格式转换
 * @param date
 * @param format
 * @returns {string}
 */
var dateFormat = exports.dateFormat = function dateFormat(date) {
  var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'yyyy-mm-dd';

  var p = {
    'm+': String(date.getMonth() + 1), //月份
    'd+': String(date.getDate()), //日
    'h+': String(date.getHours()), //小时
    'n+': String(date.getMinutes()), //分
    's+': String(date.getSeconds()) //秒
  };

  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, String(date.getFullYear()).substr(4 - 2 * RegExp.$1.length));
  }

  for (var i in p) {
    if (new RegExp('(' + i + ')').test(format)) {
      var v = RegExp.$1.length === 1 ? p[i] : ('00' + p[i]).substr(p[i].length);
      format = format.replace(RegExp.$1, v);
    }
  }

  return format;
};

var formatService = exports.formatService = function formatService(paths, apis) {
  var res = {};
  Object.keys(paths).map(function (p) {
    var it = paths[p];
    if (Object.keys(it).length > 1) {
      res[p] = Object.keys(it).map(function (key) {
        var base = _path2.default.basename(p);
        return {
          name: nameId('fetch' + base.replace(new RegExp('^(' + _constants.methodType.join('|') + ')', 'm'), '') + 'by' + key),
          path: p,
          type: key,
          it: paths[p][key]
        };
      });
    } else if (Object.keys(it).length === 1) {
      var base = _path2.default.basename(p);
      res[p] = [{
        name: nameId('fetch' + base.replace(new RegExp('^(' + _constants.methodType.join('|') + ')', 'm'), '')),
        path: p,
        type: Object.keys(it)[0],
        it: paths[p][Object.keys(it)[0]]
      }];
    }
  });
  var apisObj = {};
  apis.forEach(function (it) {
    apisObj[it.path] = it;
  });
  Object.keys(res).forEach(function (p) {
    res[p].forEach(function (i) {
      i.last = apisObj[p].last;
    });
  });
  var data = [];
  Object.keys(res).forEach(function (it) {
    data = data.concat(res[it]);
  });
  return data;
};

var getPathdeep = exports.getPathdeep = function getPathdeep(data, path, method) {
  var item = data.paths[path][method];
  // item.name = data
  // const name =
  var res = [];
  var responses = item.responses[200] && item.responses[200].schema && item.responses[200].schema.$ref;
  var work = function work(data, ref, index) {
    var dt = (0, _util.dealWithRef)(data, ref);
    var property = dt.properties;
    var it = {};
    Object.keys(property).forEach(function (key) {
      if (property[key].type === 'array') {
        it[key] = {
          type: formatType(property[key].type),
          summary: property[key].description,
          index: index
        };
        if ('$ref' in property[key].items) {
          // List ref到别的definition
          it[key].interfaceName = property[key].items.$ref.replace('#/definitions/', '');
          work(data, property[key].items.$ref, index + 1);
        } else {
          if (property[key].items && property[key].items.type) {
            it[key].innerType = formatType(property[key].items.type); //直接声明自类型
          } else {
            it[key].innerType = 'any';
          }
        }
      } else if ('$ref' in property[key]) {
        it[key] = {
          type: 'ref',
          summary: property[key].description,
          index: index
        };
        it[key].interfaceName = property[key].$ref.replace('#/definitions/', '');
        work(data, property[key].$ref, index + 1);
      } else {
        it[key] = {
          type: formatType(property[key].type),
          index: index,
          summary: property[key].description
        };
      }
    });
    res.push({
      item: it,
      interfaceName: ref.replace('#/definitions/', '')
    });
  };
  if (responses) {
    work(data, responses, 0);
  }
  return res;
};

var formatType = exports.formatType = function formatType(type) {
  if (_constants.propertyTypeMap[type]) {
    return _constants.propertyTypeMap[type];
  }
  return 'any';
};

var formatPaths = exports.formatPaths = function formatPaths(data, paths) {
  var itfaces = [];
  Object.keys(paths).forEach(function (p) {
    Object.keys(paths[p]).forEach(function (method) {
      itfaces = [].concat(_toConsumableArray(itfaces), _toConsumableArray(getPathdeep(data, p, method)));
    });
  });
  var res = itfaces;
  // 按照引用层级排序
  res = res.sort(function (a, b) {
    return b.item.index - a.item.index;
  });
  // 去重
  var tp = {};
  res.forEach(function (item) {
    if (!tp[item.interfaceName]) {
      // 保留高优先级
      tp[item.interfaceName] = item;
    }
  });
  res = Object.keys(tp).map(function (key) {
    return tp[key];
  }).sort(function (a, b) {
    return b.item.index - a.item.index;
  });
  // 命名
  var names = {};
  res.forEach(function (it) {
    names[it.interfaceName] = it[it.interfaceName];
  });
  Object.keys(names).forEach(function (it) {
    if (it.match(/^ResultVO(«?)/)) {
      names[it] = it;
      return;
    }
    if (it.match(/[\u4e00-\u9fa5]/)) {
      names[it] = nameId('Interface');
      return;
    }
    names[it] = 'I' + nameId(it.replace(/[«»]/g, ''));
  });
  res.forEach(function (it) {
    it.interfaceName = names[it.interfaceName];
    Object.keys(it.item).forEach(function (key) {
      if (it.item[key].interfaceName) {
        it.item[key].interfaceName = names[it.item[key].interfaceName];
      }
    });
  });
  // 去除ResultVO
  res = res.filter(function (it) {
    return !/^ResultVO(«?)/.test(it.interfaceName);
  });
  return res;
};
// getPathdeep(require('../../temp/api'), '/ops-activity/api/v2/sign/stealCoins', 'get')
// console.log(formatService(getApiByTag(require('../../temp/api'), 'ops-activity-controller'), getCommentForApi(getApiByTag(require('../../temp/api'), 'ops-activity-controller'))))