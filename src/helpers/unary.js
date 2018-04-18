/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import isFunction from '../core/isFunction.js'

// unary : (* -> b) -> a -> b
function unary(fn) {
  if(!isFunction(fn)) {
    throw new TypeError('unary: Function required')
  }

  return function(x) {
    return fn(x)
  }
}

export default unary
