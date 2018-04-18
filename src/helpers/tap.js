/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import curry from '../core/curry.js'
import compose from '../core/compose.js'
import isFunction from '../core/isFunction.js'

const constant = x => () => x

// tap : (a -> b) -> a -> a
function tap(fn, x) {
  if(!isFunction(fn)) {
    throw new TypeError(
      'tap: Function required for first argument'
    )
  }

  return compose(constant(x), fn)(x)
}

export default curry(tap)
