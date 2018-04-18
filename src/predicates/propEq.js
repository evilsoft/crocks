/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Karthik Iyengar (karthikiyengar) */

import curry from '../core/curry.js'
import equals from '../core/equals.js'
import isDefined from '../core/isDefined.js'
import isEmpty from '../core/isEmpty.js'
import isInteger from '../core/isInteger.js'
import isNil from '../core/isNil.js'
import isString from '../core/isString.js'

// propEq: (String | Integer) -> a -> b -> Boolean
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

export default curry(propEq)
