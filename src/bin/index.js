#!/usr/bin/env node
const com = require('./../index').default

const app = require('cmdu')

const language = require('cmdu/language/index')

app.language = 'zh-CN';
app.version = require('../../package.json').version;

app.describe('PG埋点自动化工具')

app.allowTolerance = true

app
  .option('-c, --config [config]', '配置文件目录', '.swaggerconfig.js')
  .action(function(options) {
    com(options.config)
  })
app.listen();
