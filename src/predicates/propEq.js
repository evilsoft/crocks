/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Karthik Iyengar (karthikiyengar) */

const curry = require('../core/curry')
const equals = require('../core/equals')
const isDefined = require('../core/isDefined')
const isEmpty = require('../core/isEmpty')
const isInteger = require('../core/isInteger')
const isNil = require('../core/isNil')
const isString = require('../core/isString')

/** propEq :: (String | Integer) -> a -> b -> Boolean */
function propEq(key, value, x) {
  if(!(isString(key) && !isEmpty(key) || isInteger(key))) {
    throw new TypeError(
      'propEq: Non-empty String or Integer required for first argument'
    )
  }

  if(isNil(x)) {
    return false
  }

  const target = x[key]

  return isDefined(target) && equals(target, value)
}

module.exports = curry(propEq)
