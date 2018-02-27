/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Karthik Iyengar (karthikiyengar) */
/** @author Ian Hofmann-Hicks */

const curry = require('../core/curry')
const equals = require('../core/equals')
const isArray = require('../core/isArray')
const isDefined = require('../core/isDefined')
const isEmpty  = require('../core/isEmpty')
const isInteger = require('../core/isInteger')
const isNil = require('../core/isNil')
const isString = require('../core/isString')

// propPathEq :: [ String | Number ] -> a -> Object -> Boolean
function propPathEq(keys, value, target) {
  if(!isArray(keys)) {
    throw new TypeError(
      'propPathEq: Array of Non-empty Strings or Integers required for first argument'
    )
  }

  if(isNil(target)) {
    return false
  }

  let acc = target
  for(let i = 0; i < keys.length; i++) {
    const key = keys[i]

    if(!((isString(key) && !isEmpty(key)) || isInteger(key))) {
      throw new TypeError(
        'propPathEq: Array of Non-empty Strings or Integers required for first argument'
      )
    }

    if(isNil(acc)) {
      return false
    }

    acc = acc[key]

    if(!isDefined(acc)) {
      return false
    }
  }

  return equals(acc, value)
}

module.exports = curry(propPathEq)
