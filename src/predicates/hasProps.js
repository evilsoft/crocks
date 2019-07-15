/** @license ISC License (c) copyright 2019 original and current authors */
/** @author Dale Francis (dalefrancis88) */

const curry = require('../core/curry')
const isDefined = require('../core/isDefined')
const isEmpty = require('../core/isEmpty')
const isFoldable = require('../core/isFoldable')
const isInteger = require('../core/isInteger')
const isNil = require('../core/isNil')
const isString = require('../core/isString')

// err :: String
const err =
  'hasProps: First argument must be a Foldable of Non-empty Strings or Integers'

// isKeyValid :: a -> Boolean
const isKeyValid = key =>
  isString(key) && !isEmpty(key) || isInteger(key)

// hasKey :: a -> (String | Integer) -> Boolean
const hasKey = obj => key => {
  if(!isKeyValid(key)) {
    throw new TypeError(err)
  }

  return isDefined(obj[key])
}

// every :: (a -> Boolean) -> ((Null | Boolean), a) -> Boolean
const every = fn => (acc, x) =>
  (acc === null ? true : acc) && fn(x)

// hasProps :: Foldable f => f (String | Integer) -> a -> Boolean
function hasProps(keys, x) {
  if(!isFoldable(keys)) {
    throw new TypeError(err)
  }

  if(isNil(x)) {
    return false
  }

  const result = keys.reduce(
    every(hasKey(x)),
    null
  )

  return result === null || result
}

module.exports = curry(hasProps)
