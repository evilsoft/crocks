/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import curry from '../core/curry.js'
import isFunction from '../core/isFunction.js'

// Substitution (Starling)
// substitution : (a -> b -> c) -> (a -> b) -> a -> c
function substitution(f, g, x) {
  if(!(isFunction(f) && isFunction(g))) {
    throw new TypeError(
      'substitution: Functions required for first two arguments'
    )
  }

  return curry(f)(x, g(x))
}

export default curry(substitution)
