/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import curry from '../core/curry.js'
import isExtend from '../core/isExtend.js'
import isFunction from '../core/isFunction.js'

// extend : Extend w => (w a -> b) -> w a -> w b
function extend(fn, m) {
  if(!isFunction(fn)) {
    throw new TypeError('extend: Function required for first argument')
  }
  if(!isExtend(m)) {
    throw new TypeError('extend: Extend required for second argument')
  }

  return m.extend(fn)
}

export default curry(extend)
