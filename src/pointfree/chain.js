/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import array from '../core/array.js'
const { chain: _chain } = array
import curry from '../core/curry.js'
import isArray from '../core/isArray.js'
import isChain from '../core/isChain.js'
import isFunction from '../core/isFunction.js'

// chain : Chain m => (a -> m b) -> m a -> m b
function chain(fn, m) {
  if(!isFunction(fn)) {
    throw new TypeError('chain: Chain returning function required for first argument')
  }

  if(!(isChain(m) || isArray(m))) {
    throw new TypeError('chain: Chain of the same type required for second argument')
  }

  if(isArray(m)) {
    return _chain(fn, m)
  }

  return m.chain(fn)
}

export default curry(chain)
