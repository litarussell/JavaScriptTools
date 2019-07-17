"use strict"

const utils = require('./plugins/utils')

const { extend } = utils

module.export = function (root) {
  let tools = function () {
    return new tools.fn.init()
  }
  
  let fn = tools.fn = tools.prototype = {}
  let init = fn.init = function () {}
  
  init.prototype = tools.fn

  /**
   * use方法: 用于外部插件的引入
   * plugins: 插件函数
   * flag: 是否扩展到原型的标志
   */
  tools.use = fn.tools = function (plugin) {
    let method = plugin.call(this)
    extend.call(this, method)
  }
  
  let previous_ = root._
  let previous_tools = root.tools
  
  tools.noConflict = function (deep) {
    if (root._ === tools) {
      root._ = previous_
    }
  
    if (deep && root.tools === tools) {
      root.tools = previous_tools
    }
  
    return tools
  }
  
  root._ = root.tools = tools

  return tools
}
