/**
 * Created by yuanqiangniu on 2018/8/30.
 */
import path from 'path'
/**
 * 获取所有请求方式
 * @returns {any[]}
 */
export const getRequestType = () => {
  // [ 'post', 'get', 'head', 'put', 'delete', 'options', 'patch' ]
  let keys = []
  const json = require('../../temp/api')
  Object.keys(json.paths).forEach(key => {
    keys = keys.concat(Object.keys(json.paths[key]))
  })
  return [...new Set(keys)]
}
// console.log(getRequestType())
/**
 * 获取所有数据类型
 * @returns {any[]}
 */
export const getParamTypes = () => {
  let keys = []
  // [ 'string',
  //   'integer',
  //   'boolean',
  //   'array',
  //   'object',
  //   'ref', // 不被认可的类型
  //   'file',
  //   'number' ]
  const json = require('../../temp/api')
  function work(js) {
    Object.keys(js).forEach(key => {
      if (key === 'type' && typeof js[key] === 'string') {
        keys.push(js[key])
      } else {
        if (typeof js[key] === 'object') {
          work(js[key])
        } else if (typeof js[key] === 'array') {
          js[key].forEach(it => {
            work(it)
          })
        }
      }
    })
  }
  work(json)
  return [...new Set(keys)]
}
// console.log(getParamTypes())
/**
 * 制造唯一命名
 * @param factoryName
 * @returns {function(*=): *}
 */
export const namesFactory = (factoryName) => {
  const names = {
    [factoryName]: []
  }
  return (name) => {
    let step = 0
    const oldName = name
    while (names[factoryName].indexOf(name) >= 0) {
      name = `${oldName}${step}`
      step += 1
    }
    names[factoryName].push(name)
    return name
  }
}

export const dealWithRef = (data, ref) => {
  return data.definitions[ref.replace('#/definitions/', '')]
}
// console.log(dealWithRef(require('../../temp/api'), 'ActivityTemplateList'))
// const n = namesFactory('aaa')
// console.log(getCommentForApi(getApiByTag(require('../../temp/api'), 'ops-activity-controller')))
//     api: './dist/api.ts',
//     service: './dist/service.ts',
