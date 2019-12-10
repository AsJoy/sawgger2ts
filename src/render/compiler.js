import template from 'lodash/template'
const { dateFormat } = require('../lib/format')
const through2 = require('through2')

const compilePathes = { // cache 存储的路径
}

const compilerApi = (temp, data, tempPath, payload = {}) => {
  if (!compilePathes[tempPath]) {
    compilePathes[tempPath] = data
  } else {
    if (data instanceof Array) {
      compilePathes[tempPath] = compilePathes[tempPath].concat(data)
    } else if (typeof data === 'object') {
      compilePathes[tempPath] = {
        ...compilePathes[tempPath],
        ...data,
      }
    } else if (typeof data === 'string') {
      compilePathes[tempPath] += data
    }
  }
  return template(temp)({
    date: dateFormat(new Date()),
    data: compilePathes[tempPath],
    ...payload,
  })
}

module.exports = function(data, payload = {}, output) {
  return through2.obj(function (vfile, _, cb) {
    if (vfile.isBuffer()) {
      try {
        vfile.contents = Buffer.from(compilerApi(vfile.contents, data, vfile.path, payload))
        vfile.path = output
        cb(null, vfile)
      } catch (e) {
        cb(e)
      }
    }
  })
}

module.exports.compilerApi = compilerApi
