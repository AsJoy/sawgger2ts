'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _format = require('./lib/format');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

require("regenerator-runtime/runtime");

var chalk = require('chalk');
var path = require('path');

var _require = require('./render/index'),
    build = _require.build;

var init = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(configPath) {
    var config, resources, api, service, model, promises;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            config = require(path.resolve(process.cwd(), configPath));
            resources = '/swagger-resources';
            api = config.location && config.location.api || '';
            service = config.location && config.location.service || '';
            model = config.location && config.location.model || '';
            promises = config.controllers.map(function () {
              var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(control) {
                var host, apiInfo, apiDoc, data, controller, paths, ps, apis, serivce, d;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        host = control.root;
                        _context.next = 3;
                        return (0, _axios2.default)('http://' + host + resources);

                      case 3:
                        apiInfo = _context.sent;
                        apiDoc = apiInfo.data[0].location;

                        console.log(chalk.blue('\u8BFB\u53D6swagger ' + host));
                        _context.next = 8;
                        return (0, _axios2.default)('http://' + host + apiDoc);

                      case 8:
                        data = _context.sent;

                        console.log(chalk.green(host + ' \u8BFB\u53D6\u6210\u529F'));
                        controller = control.controller;

                        // 获取所有相关path

                        paths = {};

                        if (controller) {
                          paths = (0, _format.getApiByTag)(data.data, controller);
                        }
                        ps = control.paths;

                        if (ps && ps.length) {
                          ps.forEach(function (it) {
                            if (data.data.paths[it]) {
                              paths[it] = data.data.paths[it];
                            }
                          });
                        }
                        apis = (0, _format.getCommentForApi)(paths);

                        if (api) {
                          build(apis, path.resolve(__dirname, '../temp/api.ts.tpl'), api);
                          console.log(chalk.green(host + ' api\u5199\u5165\u6210\u529F'));
                        }
                        serivce = apis;

                        if (service) {
                          build((0, _format.formatService)(paths, apis), path.resolve(__dirname, '../temp/service.ts.tpl'), service, {
                            relative: ('./' + path.relative(service.replace(path.basename(service), ''), api)).replace(/\.ts$/, '')
                          });
                          console.log(chalk.green(host + ' service\u5199\u5165\u6210\u529F'));
                        }
                        d = (0, _format.formatPaths)(data.data, paths);

                        if (model) {
                          build(d, path.resolve(__dirname, '../temp/model.ts.tpl'), model);
                          console.log(chalk.green(host + ' model\u5199\u5165\u6210\u529F'));
                        }

                      case 21:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, _callee, undefined);
              }));

              return function (_x2) {
                return _ref2.apply(this, arguments);
              };
            }());
            _context2.next = 8;
            return Promise.all(promises);

          case 8:

            console.log(chalk.green('the end'));

          case 9:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function init(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.default = init;