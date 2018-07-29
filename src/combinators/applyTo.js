/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import curry from '../core/curry'
import isFunction from '../core/isFunction'

// Application (Thrush)
// applyTo :: a -> (a -> b) -> b
function applyTo(x, f) {
  if(!isFunction(f)) {
    throw new TypeError('applyTo: Function required for second argument')
  }

  return f(x)
}

export default curry(applyTo)
