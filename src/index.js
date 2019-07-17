"use strict"

import tools from './tools'
import plugins from './plugins'

(function () {
  var hasDefine = typeof define === 'function',
    hasExports = typeof module !== 'undefined' && module.exports,
    root = (typeof self == 'object' && self.self === self && self) ||
    (typeof global == 'object' && global.global === global && global)
  if (hasDefine) {
    define(tools);
  } else if (hasExports) {
    module.exports = tools(root)
  } else {
    tools(root)
  }
})()