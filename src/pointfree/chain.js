/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const _chain = require('../core/array').chain
const curry = require('../core/curry')
const isArray = require('../core/isArray')
const isChain = require('../core/isChain')
const isFunction = require('../core/isFunction')
const fl = require('../core/flNames')

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

  return (m[fl.chain] || m.chain).bind(m)(fn)
}

module.exports = curry(chain)
