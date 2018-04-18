/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import _curry from '../core/curry.js'
import isFunction from '../core/isFunction.js'

// curry : ((a, b, c) -> d) -> a -> b -> c -> d
function curry(fn) {
  if(!isFunction(fn)) {
    throw new TypeError('curry: Function required')
  }

  return _curry(fn)
}

export default curry
