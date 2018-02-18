/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Karthik Iyengar (karthikiyengar) */

const curry = require('../core/curry')
const equals = require('../core/equals')
const isObject = require('../core/isObject')

// propEq: (String | Number) -> a -> Object -> Boolean
function propEq(key, value, x) {
  if (!isObject(x)) {
    throw new TypeError('propEq: Object required for third argument')
  }
  return equals(x[key], value)
}

module.exports = curry(propEq)
