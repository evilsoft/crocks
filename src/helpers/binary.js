/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import curryN from '../core/curryN.js'
import isFunction from '../core/isFunction.js'

// binary : (* -> c) -> a -> b -> c
function binary(fn) {
  if(!isFunction(fn)) {
    throw new TypeError('binary: Function required')
  }

  return curryN(2, fn)
}

export default binary
