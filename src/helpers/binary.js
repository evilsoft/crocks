/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import curryN from '../core/curryN'
import isFunction from '../core/isFunction'

// binary : (* -> c) -> a -> b -> c
export default function binary(fn) {
  if(!isFunction(fn)) {
    throw new TypeError('binary: Function required')
  }

  return curryN(2, fn)
}
