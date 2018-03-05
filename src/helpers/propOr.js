/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Henrique Limas */
/** @author Ian Hofmann-Hicks */

const curry = require('../core/curry')
const isDefined = require('../core/isDefined')
const isEmpty = require('../core/isEmpty')
const isNil = require('../core/isNil')
const isInteger = require('../core/isInteger')
const isString = require('../core/isString')

// propOr : a -> String | Integer -> b -> c
function propOr(def, key, target) {
  if(!(isString(key) && !isEmpty(key) || isInteger(key))) {
    throw new TypeError('propOr: Non-empty String or Integer required for second argument')
  }

  if(isNil(target)) {
    return def
  }

  const value = target[key]

  return isDefined(value)
    ? value
    : def
}

module.exports = curry(propOr)
