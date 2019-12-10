'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _template = require('lodash/template');

var _template2 = _interopRequireDefault(_template);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _require = require('../lib/format'),
    dateFormat = _require.dateFormat;

var through2 = require('through2');

var compilePathes = {// cache 存储的路径
};

var compilerApi = function compilerApi(temp, data, tempPath) {
  var payload = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  if (!compilePathes[tempPath]) {
    compilePathes[tempPath] = data;
  } else {
    if (data instanceof Array) {
      compilePathes[tempPath] = compilePathes[tempPath].concat(data);
    } else if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object') {
      compilePathes[tempPath] = _extends({}, compilePathes[tempPath], data);
    } else if (typeof data === 'string') {
      compilePathes[tempPath] += data;
    }
  }
  return (0, _template2.default)(temp)(_extends({
    date: dateFormat(new Date()),
    data: compilePathes[tempPath]
  }, payload));
};

module.exports = function (data) {
  var payload = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var output = arguments[2];

  return through2.obj(function (vfile, _, cb) {
    if (vfile.isBuffer()) {
      try {
        vfile.contents = Buffer.from(compilerApi(vfile.contents, data, vfile.path, payload));
        vfile.path = output;
        cb(null, vfile);
      } catch (e) {
        cb(e);
      }
    }
  });
};

module.exports.compilerApi = compilerApi;