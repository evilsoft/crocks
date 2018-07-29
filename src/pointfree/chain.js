/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import { chain as _chain } from '../core/array'
import curry from '../core/curry'
import isArray from '../core/isArray'
import isChain from '../core/isChain'
import isFunction from '../core/isFunction'
import fl from '../core/flNames'

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

  return (m[fl.chain] || m.chain).call(m, fn)
}

export default curry(chain)
