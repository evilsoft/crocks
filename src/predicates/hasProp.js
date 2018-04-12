/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import curry from '../core/curry.js'
import isDefined from '../core/isDefined.js'
import isEmpty from '../core/isEmpty.js'
import isInteger from '../core/isInteger.js'
import isNil from '../core/isNil.js'
import isString from '../core/isString.js'

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

export default curry(hasProp)
