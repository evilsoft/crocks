/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Henrique Limas */
/** @author Ian Hofmann-Hicks */

import curry from '../core/curry.js'
import isArray from '../core/isArray.js'
import isEmpty from '../core/isEmpty.js'
import isInteger from '../core/isInteger.js'
import isDefined from '../core/isDefined.js'
import isNil from '../core/isNil.js'
import isString from '../core/isString.js'

// propPathOr : a -> [ String | Integer ] -> b -> c
function propPathOr(def, keys, target) {
  if(!isArray(keys)) {
    throw new TypeError(
      'propPathOr: Array of Non-empty Strings or Integers required for second argument'
    )
  }

  if(isNil(target)) {
    return def
  }

  let value = target
  for(let i = 0; i < keys.length; i++) {
    const key = keys[i]

    if(!(isString(key) && !isEmpty(key) || isInteger(key))) {
      throw new TypeError(
        'propPathOr: Array of Non-empty Strings or Integers required for second argument'
      )
    }

    if(isNil(value)) {
      return def
    }

    value = value[key]

    if(!isDefined(value)) {
      return def
    }
  }

  return value
}

export default curry(propPathOr)
