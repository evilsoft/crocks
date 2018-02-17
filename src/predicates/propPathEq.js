/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Karthik Iyengar (karthikiyengar) */

const curry = require('../core/curry')
const isArray = require('../core/isArray')
const isInteger = require('../core/isInteger')
const isNil= require('../core/isNil')
const isString = require('../core/isString')
const equals = require('../core/equals')

// propPathEq :: [String | Number] -> a -> Object -> Boolean
function propPathEq(path, value, target) {
  if(!isArray(path)) {
    throw new TypeError('propPathEq: Array of strings or integers required for first argument')
  }
  let index = 0
  let acc = target
  const length = path.length
  while (index < length) {
    const key = path[index]
    if (!(isString(key) || isInteger(key))) {
      throw new TypeError(
        'propPathEq: Array of strings or integers required for first argument'
      )
    }
    if (isNil(acc)) {
      return equals(undefined, value)
    }
    acc = acc[key]
    index += 1
  }
  return equals(acc, value)
}

module.exports = curry(propPathEq)
