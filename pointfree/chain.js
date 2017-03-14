/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../helpers/curry')

const isArray = require('../predicates/isArray')
const isChain = require('../predicates/isChain')
const isFunction = require('../predicates/isFunction')

const _chain = require('../internal/array').chain

// chain :: Chain m => (a -> m b) -> m a -> m b
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

module.exports = curry(chain)
