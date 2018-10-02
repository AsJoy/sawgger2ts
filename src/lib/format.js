/**
 * Created by yuanqiangniu on 2018/8/31.
 */
import { namesFactory, dealWithRef } from './util'
import { methodType, propertyTypeMap } from './constants'
import path from 'path'

const nameId = namesFactory('path')

/**
 * 根据tag获取api
 * @param json
 * @param tag
 */
export const getApiByTag = (json, tag) => {
  const paths = json.paths
  const Api = {}
  Object.keys(paths).forEach(api => {
    Object.keys(paths[api]).forEach(method => {
      if (paths[api][method].tags.indexOf(tag) >= 0) {
        if (Api[api]) {
          Api[api][method] = paths[api][method]
        } else {
          Api[api] = {
            [method]: paths[api][method]
          }
        }
      }
    })
  })
  return Api
}
/**
 * 获取api数据
 * @param paths
 * @returns {{path: string, comment: Array, last: (*|void)}[]}
 */
export const getCommentForApi = (paths) => {
  let res = Object.keys(paths)
  const getComment = (it) => {
    const res = []
    if (Object.keys(it).length > 1) {
      Object.keys(it).forEach(method => {
        res.push(`${method}:${it[method].summary}`)
      })
      return res
    }
    Object.keys(it).forEach(method => {
      res.push(`${it[method].summary}`)
    })
    return res
  }
  const getLast = (path) => {
    if (/\/([a-zA-Z0-9\-_]*)$/.test(path)) {
      return nameId(RegExp.$1)
    }
  }
  res = res.map(it => {
    return {
      path: it,
      comment: getComment(paths[it]),
      last: getLast(it),
    }
  })
  return res
}
// console.log(getApiByTag(require('../../temp/api'), 'ops-activity-controller'))
/**
 * 时间格式转换
 * @param date
 * @param format
 * @returns {string}
 */
export const dateFormat = (date, format = 'yyyy-mm-dd') => {
  let p = {
    'm+': String(date.getMonth() + 1),  //月份
    'd+': String(date.getDate()),       //日
    'h+': String(date.getHours()),      //小时
    'n+': String(date.getMinutes()),    //分
    's+': String(date.getSeconds()),     //秒
  }

  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (String(date.getFullYear())).substr(4 - 2 * RegExp.$1.length))
  }

  for (let i in p) {
    if (new RegExp('(' + i + ')').test(format)) {
      let v = RegExp.$1.length === 1 ? p[i] : ('00' + p[i]).substr(p[i].length)
      format = format.replace(RegExp.$1, v)
    }
  }

  return format
}

export const formatService = (paths, apis) => {
  const res = {}
  Object.keys(paths).map(p => {
    const it = paths[p]
    if (Object.keys(it).length > 1) {
      res[p] = Object.keys(it).map(key => {
        const base = path.basename(p)
        return {
          name: nameId(`fetch${base.replace(new RegExp(`^(${methodType.join('|')})`, 'm'), '')}by${key}`),
          path: p,
          type: key,
          it: paths[p][key],
        }
      })
    } else if (Object.keys(it).length === 1) {
      const base = path.basename(p)
      res[p] = [
        {
          name: nameId(`fetch${base.replace(new RegExp(`^(${methodType.join('|')})`, 'm'), '')}`),
          path: p,
          type: Object.keys(it)[0],
          it: paths[p][Object.keys(it)[0]],
        },
      ]
    }
  })
  const apisObj = {}
  apis.forEach(it => {
    apisObj[it.path] = it
  })
  Object.keys(res).forEach(p => {
    res[p].forEach(i => {
      i.last = apisObj[p].last
    })
  })
  let data = []
  Object.keys(res).forEach(it => {
    data = data.concat(res[it])
  })
  return data
}

export const getPathdeep = (data, path, method) => {
  const item = data.paths[path][method]
  // item.name = data
  // const name =
  let res = []
  const responses = item.responses[200] && item.responses[200].schema && item.responses[200].schema.$ref
  const work = (data, ref, index) => {
    const dt = dealWithRef(data, ref)
    const property = dt.properties
    const it = {}
    Object.keys(property).forEach(key => {
      if (property[key].type === 'array') {
        it[key] = {
          type: formatType(property[key].type),
          summary: property[key].description,
          index: index,
        }
        if ('$ref' in property[key].items) { // List ref到别的definition
          it[key].interfaceName = property[key].items.$ref.replace('#/definitions/', '')
          work(data, property[key].items.$ref, index + 1)
        } else {
          if (property[key].items && property[key].items.type) {
            it[key].innerType = formatType(property[key].items.type) //直接声明自类型
          } else {
            it[key].innerType = 'any'
          }
        }
      } else if ('$ref' in property[key]) {
        it[key] = {
          type: 'ref',
          summary: property[key].description,
          index: index,
        }
        it[key].interfaceName = property[key].$ref.replace('#/definitions/', '')
        work(data, property[key].$ref, index + 1)
      } else {
        it[key] = {
          type: formatType(property[key].type),
          index: index,
          summary: property[key].description
        }
      }
    })
    res.push({
      item: it,
      interfaceName: ref.replace('#/definitions/', ''),
    })
  }
  if (responses) {
    work(data, responses, 0)
  }
  return res
}

export const formatType = (type) => {
  if (propertyTypeMap[type]) {
    return propertyTypeMap[type]
  }
  return 'any'
}

export const formatPaths = (data, paths) => {
  let itfaces = []
  Object.keys(paths).forEach(p => {
    Object.keys(paths[p]).forEach(method => {
      itfaces = [...itfaces, ...getPathdeep(data, p, method)]
    })
  })
  let res = itfaces
  // 按照引用层级排序
  res = res.sort((a, b) => b.item.index - a.item.index)
  // 去重
  const tp = {}
  res.forEach(item => {
    if (!tp[item.interfaceName]) { // 保留高优先级
      tp[item.interfaceName] = item
    }
  })
  res = Object.keys(tp).map(key => tp[key]).sort((a, b) => b.item.index - a.item.index)
  // 命名
  const names = {}
  res.forEach(it => {
    names[it.interfaceName] = it[it.interfaceName]
  })
  Object.keys(names).forEach(it => {
    if (it.match(/^ResultVO(«?)/)) {
      names[it] = it
      return
    }
    if (it.match(/[\u4e00-\u9fa5]/)) {
      names[it] = nameId('Interface')
      return
    }
    names[it] = `I${nameId(it.replace(/[«»]/g, ''))}`
  })
  res.forEach(it => {
    it.interfaceName = names[it.interfaceName]
    Object.keys(it.item).forEach(key => {
      if (it.item[key].interfaceName) {
        it.item[key].interfaceName = names[it.item[key].interfaceName]
      }
    })
  })
  // 去除ResultVO
  res = res.filter(it => !/^ResultVO(«?)/.test(it.interfaceName))
  return res
}
// getPathdeep(require('../../temp/api'), '/ops-activity/api/v2/sign/stealCoins', 'get')
// console.log(formatService(getApiByTag(require('../../temp/api'), 'ops-activity-controller'), getCommentForApi(getApiByTag(require('../../temp/api'), 'ops-activity-controller'))))
