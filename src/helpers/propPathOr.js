/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Henrique Limas */

const curry = require('../core/curry')
const isArray = require('../core/isArray')
const isInteger = require('../core/isInteger')
const isNil= require('../core/isNil')
const isString = require('../core/isString')

// propPathOr : a -> [ String | Integer ] -> b -> c
function propPathOr(def, keys, target) {
  if(!isArray(keys)) {
    throw new TypeError('propPathOr: Array of strings or integers required for second argument')
  }

  if(isNil(target)) {
    return def
  }

  const value = keys.reduce((target, key) => {
    if (isNil(target)) {
      return target
    }

    if(!(isString(key) || isInteger(key))) {
      throw new TypeError('propPathOr: Array of strings or integers required for second argument')
    }

    return target[key]
  }, target)

  return isNil(value) ? def : value
}

module.exports = curry(propPathOr)
