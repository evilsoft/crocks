/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import curry from '../core/curry.js'
import isFunction from '../core/isFunction.js'

// Flip (Cardinal)
//  flip :: (a -> b -> c) -> b -> a -> c
function flip(f, x, y) {
  if(!isFunction(f)) {
    throw new TypeError(
      'flip: Function required for first argument'
    )
  }

  return curry(f)(y, x)
}

export default curry(flip)
