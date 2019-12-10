const { src, dest } = require('gulp');
const compiler = require('./compiler')
const { style } = require('./style')
const path = require('path')
const chalk = require('chalk');

function doBuild(data, entry, output, payload, cb) {
    output = path.resolve(process.cwd(), output)
    return src(path.resolve(__dirname, entry))
      .pipe(compiler(data, payload, output))
      .pipe(dest(path.dirname(output))).on('end', cb)
}

function doStyle(output) {
    output = path.resolve(process.cwd(), output)
    style([output])
}

exports.build = function (data, entry, output, payload) {
    return doBuild(data, entry, output, payload, function (err) {
        console.log(chalk.blue(`${output} tslint prettier 风格优化`))
        if (!err) {
            doStyle(output)
        }
    })
};

