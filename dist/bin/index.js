#!/usr/bin/env node
'use strict';

var com = require('./../index').default;

var app = require('cmdu');

var language = require('cmdu/language/index');

app.language = 'zh-CN';
app.version = require('../../package.json').version;

app.describe('PG埋点自动化工具');

app.allowTolerance = true;

app.option('-c, --config [config]', '配置文件目录', '.swaggerconfig.js').action(function (options) {
  com(options.config);
});
app.listen();