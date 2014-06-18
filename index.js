'use strict'

var metaz = require('metaz')

// Invalidate require cache on each require to get the parent filename again
delete require.cache[__filename]
var source = metaz.getSource(module.parent)
var filePath = module.parent.filename.replace(/[^\/]*$/, '')
var regexp = new RegExp('require\([\'"]florist[\'"]\)', 'g')

var florist = /require\('florist'\)\[\s*[\'"]([\w./\-]+)[\'"]\s*,\s*\[([^\]]+)\s*\]\s*\]/g
source = source.replace(florist, function (match, module, rawMethods) {
  var methods = rawMethods.replace(/['"]/g, '').split(',').map(function (method) {
    return method.trim()
  })

  var modulePath = module.replace(/$(\..*)/, filePath + '$1')

  methods.forEach(function (method) {
    GLOBAL[method] = require(modulePath)[method]
  })

  return methods.map(function (method) {
    return 'var ' + method + ' = require("' + modulePath + '")["' + method + '"];'
  }).join('')
})


metaz.modifyExports(module.parent, metaz.getExports(module.parent, source))
