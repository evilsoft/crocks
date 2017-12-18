/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Henrique Limas */

const curry = require('../core/curry')
const isNil= require('../core/isNil')
const isInteger = require('../core/isInteger')
const isString = require('../core/isString')

const lift = (x, def) =>
  isNil(x) ? def : x

// propOr : a -> String | Integer -> b -> c
function propOr(def, key, target) {
  if(!(isString(key) || isInteger(key))) {
    throw new TypeError('propOr: String or integer required for second argument')
  }

  if(isNil(target)) {
    return def
  }

  return lift(target[key], def)
}

module.exports = curry(propOr)
