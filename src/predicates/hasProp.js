/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import curry from '../core/curry'
import isDefined from '../core/isDefined'
import isEmpty from '../core/isEmpty'
import isInteger from '../core/isInteger'
import isNil from '../core/isNil'
import isString from '../core/isString'

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
