var utils = require('./utils')
var config = require('../config')
// var isProduction = process.env.NODE_ENV === 'production'
// for mp
var isProduction = true // all use sourcemap
// console.log("vue-loader.conf.js-------------", isProduction)

module.exports = {
  loaders: utils.cssLoaders({
    sourceMap: isProduction
      ? config.build.productionSourceMap
      : config.dev.cssSourceMap,
    extract: isProduction
  }),
  transformToRequire: {
    video: 'src',
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  }
}
