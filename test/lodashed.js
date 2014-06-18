'use strict'
require('florist')['lodash', ['map', 'reduce']]

module.exports = reduce(map([1, 2, 3], function (num) {
  return 1 + num
}), function (sum, num) {
  return sum + num
})
