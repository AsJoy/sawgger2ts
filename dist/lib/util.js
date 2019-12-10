'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dealWithRef = exports.namesFactory = exports.getParamTypes = exports.getRequestType = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /**
                                                                                                                                                                                                     * Created by yuanqiangniu on 2018/8/30.
                                                                                                                                                                                                     */


/**
 * 获取所有请求方式
 * @returns {any[]}
 */
var getRequestType = exports.getRequestType = function getRequestType() {
  // [ 'post', 'get', 'head', 'put', 'delete', 'options', 'patch' ]
  var keys = [];
  var json = require('../../temp/api');
  Object.keys(json.paths).forEach(function (key) {
    keys = keys.concat(Object.keys(json.paths[key]));
  });
  return [].concat(_toConsumableArray(new Set(keys)));
};
// console.log(getRequestType())
/**
 * 获取所有数据类型
 * @returns {any[]}
 */
var getParamTypes = exports.getParamTypes = function getParamTypes() {
  var keys = [];
  // [ 'string',
  //   'integer',
  //   'boolean',
  //   'array',
  //   'object',
  //   'ref', // 不被认可的类型
  //   'file',
  //   'number' ]
  var json = require('../../temp/api');
  function work(js) {
    Object.keys(js).forEach(function (key) {
      if (key === 'type' && typeof js[key] === 'string') {
        keys.push(js[key]);
      } else {
        if (_typeof(js[key]) === 'object') {
          work(js[key]);
        } else if (typeof js[key] === 'array') {
          js[key].forEach(function (it) {
            work(it);
          });
        }
      }
    });
  }
  work(json);
  return [].concat(_toConsumableArray(new Set(keys)));
};
// console.log(getParamTypes())
/**
 * 制造唯一命名
 * @param factoryName
 * @returns {function(*=): *}
 */
var namesFactory = exports.namesFactory = function namesFactory(factoryName) {
  var names = _defineProperty({}, factoryName, []);
  return function (name) {
    var step = 0;
    var oldName = name;
    while (names[factoryName].indexOf(name) >= 0) {
      name = '' + oldName + step;
      step += 1;
    }
    names[factoryName].push(name);
    return name;
  };
};

var dealWithRef = exports.dealWithRef = function dealWithRef(data, ref) {
  return data.definitions[ref.replace('#/definitions/', '')];
};
// console.log(dealWithRef(require('../../temp/api'), 'ActivityTemplateList'))
// const n = namesFactory('aaa')
// console.log(getCommentForApi(getApiByTag(require('../../temp/api'), 'ops-activity-controller')))
//     api: './dist/api.ts',
//     service: './dist/service.ts',