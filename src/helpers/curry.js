/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import _curry from '../core/curry'
import isFunction from '../core/isFunction'

// curry : ((a, b, c) -> d) -> a -> b -> c -> d
export default function curry(fn) {
  if(!isFunction(fn)) {
    throw new TypeError('curry: Function required')
  }

  return _curry(fn)
}
