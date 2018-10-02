const juicer = require('juicer')
const fse = require('fs-extra')
const path = require('path')
import { dateFormat } from './lib/format'

juicer.set({
  'tag::operationOpen': '{@',
  'tag::operationClose': '}',
  'tag::interpolateOpen': '#{',
  'tag::interpolateClose': '}',
  'tag::noneencodeOpen': '$${',
  'tag::noneencodeClose': '}',
  'tag::commentOpen': '{#',
  'tag::commentClose': '}'
});

const compilePathes = { // cache 存储的路径
}

const compilerApi = (data, tempPath, p, payload = {}) => {
  const pwd =  process.cwd()
  const temp = fse.readFileSync(tempPath)
    .toString()
  juicer.set('strip', false)
  // if (!compilePathes[tempPath]) {
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

  let res = juicer(temp, {
    date: dateFormat(new Date()),
    data: compilePathes[tempPath],
    ...payload,
  })

  const apiFileName = path.basename(p)
  const dir = path.resolve(pwd, p.replace(apiFileName, ''))

  if (!fse.pathExistsSync(dir)) {
    fse.mkdirsSync(dir)
  }
  fse.writeFileSync(path.resolve(pwd, p), res)
  // } else {
  //   fse.appendFileSync(path.resolve(pwd, p), res)
  // }
  return res
}


export default compilerApi
