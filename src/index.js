const chalk = require('chalk');
import axios from 'axios'
import path from 'path'
import compiler from './compiler'
require("regenerator-runtime/runtime");
import { getApiByTag, getCommentForApi, formatService, formatPaths } from './lib/format'

const init = async (configPath) => {
  const config = require(path.resolve(process.cwd(), configPath))
  const resources = '/swagger-resources'
  const api = config.location && config.location.api || ''
  const service = config.location && config.location.service || ''
  const model = config.location && config.location.model || ''
  const promises = config.controllers.map(async (control) => {
    const host = control.root
    const apiInfo = await axios(`http://${host}${resources}`)
    const apiDoc = apiInfo.data[0].location
    console.log(chalk.blue(`读取swagger ${host}`))
    const data = await axios(`http://${host}${apiDoc}`)
    console.log(chalk.green(`${host} 读取成功`))
    const controller = control.controller

    // 获取所有相关path
    let paths = {}
    if (controller) {
      paths = getApiByTag(data.data, controller)
    }
    const ps = control.paths
    if (ps && ps.length) {
      ps.forEach(it => {
        if (data.data.paths[it]) {
          paths[it] = data.data.paths[it]
        }
      })
    }
    const apis = getCommentForApi(paths)
    if (api) {
      compiler(apis, path.resolve(__dirname, '../temp/api.ts.juicer'), api);
      console.log(chalk.green(`${host} api写入成功`))
    }
    // const serivce = apis
    if (service) {
      compiler(formatService(paths, apis), path.resolve(__dirname, '../temp/service.ts.juicer'), service, {
        relative: `./${path.relative(service.replace(path.basename(service), ''), api)}`.replace(/\.ts$/, '')
      });
      console.log(chalk.green(`${host} service写入成功`))
    }
    const d = formatPaths(data.data, paths)
    if (model) {
      compiler(d, path.resolve(__dirname, '../temp/model.ts.juicer'), model);
      console.log(chalk.green(`${host} model写入成功`))
    }
})

  await Promise.all(promises)

  console.log(chalk.green(`the end`))
}

export default init
