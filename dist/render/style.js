'use strict';

/**
 * Created by yuanqiangniu on 2019/12/10.
 */
var _require = require('gts/build/src/util'),
    isYarnUsed = _require.isYarnUsed;

var _require2 = require('gts/build/src/lint'),
    lint = _require2.lint;

var _require3 = require('gts/build/src/format'),
    format = _require3.format;

var path = require('path');

function style(files) {
    var options = {
        dryRun: false,
        gtsRootDir: path.resolve(__dirname, '../../node_modules/gts'),
        targetRootDir: process.cwd(),
        yes: false,
        no: false,
        logger: console,
        yarn: isYarnUsed()
    };
    if (lint(options, files, true)) {
        return format(options, files, true);
    }
    return Promise.resolve(0);
}

module.exports.style = style;