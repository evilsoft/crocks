/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import curry from '../core/curry.js'
import isArray from '../core/isArray.js'
import isFunction from '../core/isFunction.js'

function cons(x, m) {
  if(m && isFunction(m.cons)) {
    return m.cons(x)
  }
  else if(isArray(m)) {
    return [ x ].concat(m)
  }

  throw new TypeError('cons: List or Array required for second argument')
}

export default curry(cons)
