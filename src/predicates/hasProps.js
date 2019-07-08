/** @license ISC License (c) copyright 2019 original and current authors */
/** @author Dale Francis (dalefrancis88) */

const curry = require('../core/curry')
const isArray = require('../core/isArray')
const isDefined = require('../core/isDefined')
const isEmpty = require('../core/isEmpty')
const isInteger = require('../core/isInteger')
const isNil = require('../core/isNil')

const isValid = keys =>
  isArray(keys) && !isEmpty(keys) && keys.every(key => !isEmpty(key) || isInteger(key))

// hasProps : Foldable (String | Integer) -> a -> Boolean
function hasProps(keys, x) {
  if(!isValid(keys)) {
    throw new TypeError(
      'hasProps: First argument must be an Array of Non-empty Strings or Integers'
    )
  }

  if(isNil(x)) {
    return false
  }

  return keys.every(key => isDefined(x[key]))
}

module.exports = curry(hasProps)
