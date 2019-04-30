/** @license ISC License (c) copyright 2018 original and current authors */
/** @author Dale Francis (dalefrancis88) */

const curry = require('../core/curry')
const isBiChain = require('../core/isBiChain')
const isFunction = require('../core/isFunction')

// bichain : bichain m => (e -> m c b) -> (a -> m c b) -> m e a -> m c b
function bichain(f, g, m) {
  if(!isFunction(f) || !isFunction(g)) {
    throw new TypeError('bichain: Functions required for both arguments')
  }

  if(!isBiChain(m)) {
    throw new TypeError('chain: Chain of the same type required for second argument')
  }

  return m.bichain.call(m, f, g)
}

module.exports = curry(bichain)
