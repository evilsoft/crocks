/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import curry from '../core/curry'
import isArray from '../core/isArray'
import isDefined from '../core/isDefined'
import isEmpty from '../core/isEmpty'
import isInteger from '../core/isInteger'
import isNil from '../core/isNil'
import isString from '../core/isString'

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
