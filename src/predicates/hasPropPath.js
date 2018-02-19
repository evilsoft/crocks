/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../core/curry')
const isArray = require('../core/isArray')
const isDefined = require('../core/isDefined')
const isEmpty = require('../core/isEmpty')
const isInteger = require('../core/isInteger')
const isNil = require('../core/isNil')
const isString = require('../core/isString')

// hasPropPath : [ String | Integer ] -> a -> Boolean
function hasPropPath(keys, target) {
  if(!isArray(keys)) {
    throw new TypeError(
      'hasPropPath: Array of Non-empty Strings or Integers required for first argument'
    )
  }

  if (isNil(target)) {
    return false
  }

  let value = target
  for(let i = 0; i < keys.length; i++) {
    const key = keys[i]

    if(!((isString(key) && !isEmpty(key)) || isInteger(key))) {
      throw new TypeError(
        'hasPropPath: Array of Non-empty Strings or Integers required for first argument'
      )
    }

    value = value[key]

    if(!isDefined(value)) {
      return false
    }
  }


  return true
}

module.exports = curry(hasPropPath)
