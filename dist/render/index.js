'use strict';

var _require = require('gulp'),
    src = _require.src,
    dest = _require.dest;

var compiler = require('./compiler');

var _require2 = require('./style'),
    style = _require2.style;

var path = require('path');
var chalk = require('chalk');

function doBuild(data, entry, output, payload, cb) {
    output = path.resolve(process.cwd(), output);
    return src(path.resolve(__dirname, entry)).pipe(compiler(data, payload, output)).pipe(dest(path.dirname(output))).on('end', cb);
}

function doStyle(output) {
    output = path.resolve(process.cwd(), output);
    style([output]);
}

exports.build = function (data, entry, output, payload) {
    return doBuild(data, entry, output, payload, function (err) {
        console.log(chalk.blue(output + ' tslint prettier \u98CE\u683C\u4F18\u5316'));
        if (!err) {
            doStyle(output);
        }
    });
};