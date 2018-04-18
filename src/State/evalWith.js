/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import curry from '../core/curry.js'
import isFunction from '../core/isFunction.js'

function evalWith(x, m) {
  if(!(m && isFunction(m.evalWith))) {
    throw new TypeError('evalWith: State required for second argument')
  }

  return m.evalWith(x)
}

export default curry(evalWith)
