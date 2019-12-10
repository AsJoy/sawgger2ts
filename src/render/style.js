/**
 * Created by yuanqiangniu on 2019/12/10.
 */
const { isYarnUsed } = require('gts/build/src/util')
const { lint } = require('gts/build/src/lint')
const { format } = require('gts/build/src/format')
const path = require('path')

function style(files) {
    const options = {
        dryRun: false,
        gtsRootDir: path.resolve(__dirname, '../../node_modules/gts'),
        targetRootDir: process.cwd(),
        yes: false,
        no: false,
        logger: console,
        yarn: isYarnUsed(),
    };
    if (lint(options, files, true)) {
        return format(options, files, true)
    }
    return Promise.resolve(0)
}

module.exports.style = style
