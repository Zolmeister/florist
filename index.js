'use strict'

var metaz = require('metaz')

// Invalidate require cache on each require to get the parent filename again
delete require.cache[__filename]

module.exports = function (libraryName, methods) {
  var source = metaz.getSource(module.parent)
  var filePath = module.parent.filename.replace(/[^\/]*$/, '')
  var libraryPath = libraryName.replace(/$(\..*)/, filePath + '$1')
  var library = require(libraryPath)
  methods = methods || Object.keys(library)

  var florist = /require\('florist'\)\([^)]+\)/g
  source = source.replace(florist, function () {

    methods.forEach(function (method) {
      GLOBAL[method] = library[method]
    })

    return methods.map(function (method) {
      return 'var ' + method + ' = require("' + libraryPath + '")["' + method + '"];'
    }).join('')
  })


  metaz.modifyExports(module.parent, metaz.getExports(module.parent, source))
}
