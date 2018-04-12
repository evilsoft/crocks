/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import curry from '../core/curry.js'
import isArray from '../core/isArray.js'
import isDefined from '../core/isDefined.js'
import isEmpty from '../core/isEmpty.js'
import isInteger from '../core/isInteger.js'
import isNil from '../core/isNil.js'
import isString from '../core/isString.js'

// hasPropPath : [ String | Integer ] -> a -> Boolean
function hasPropPath(keys, target) {
  if(!isArray(keys)) {
    throw new TypeError(
      'hasPropPath: Array of Non-empty Strings or Integers required for first argument'
    )
  }

  if(isNil(target)) {
    return false
  }

  let value = target

  for(let i = 0; i < keys.length; i++) {
    const key = keys[i]

    if(!(isString(key) && !isEmpty(key) || isInteger(key))) {
      throw new TypeError(
        'hasPropPath: Array of Non-empty Strings or Integers required for first argument'
      )
    }

    if(isNil(value)) {
      return false
    }

    value = value[key]

    if(!isDefined(value)) {
      return false
    }
  }

  return true
}

export default curry(hasPropPath)
