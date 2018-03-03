/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../core/curry')
const isDefined = require('../core/isDefined')
const isEmpty = require('../core/isEmpty')
const isInteger = require('../core/isInteger')
const isNil = require('../core/isNil')
const isString = require('../core/isString')

// hasProp : (String | Integer) -> a -> Boolean
function hasProp(key, x) {
  if(!(isString(key) && !isEmpty(key) || isInteger(key))) {
    throw new TypeError(
      'hasProp: Non-empty String or Integer required for first argument'
    )
  }

  if(isNil(x)) {
    return false
  }

  return isDefined(x[key])
}

module.exports = curry(hasProp)
