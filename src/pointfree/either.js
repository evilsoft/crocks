/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import curry from '../core/curry'
import isFunction from '../core/isFunction'

function either(lf, rf, m) {
  if(!(isFunction(lf) && isFunction(rf))) {
    throw new TypeError(
      'either: First two arguments must be functions'
    )
  }

  if(!(m && isFunction(m.either))) {
    throw new TypeError(
      'either: Last argument must be a Sum Type'
    )
  }

  return m.either(lf, rf)
}

export default curry(either)
