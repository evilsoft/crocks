/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Karthik Iyengar (karthikiyengar) */

const curry = require('../core/curry')
const isArray = require('../core/isArray')
const isNil= require('../core/isNil')
const equals = require('../core/equals')

// propPathEq :: [String | Number] -> a -> Object -> Boolean
function propPathEq(path, value, target) {
  if(!isArray(path)) {
    throw new TypeError('propPathEq: Array of strings or integers required for first argument')
  }
  let acc = target
  const length = path.length
  for (let index = 0; index < length; index++) {
    if (isNil(acc)) {
      return equals(undefined, value)
    }
    acc = acc[path[index]]
  }
  return equals(acc, value)
}

module.exports = curry(propPathEq)
