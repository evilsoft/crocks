/** @license ISC License (c) copyright 2019 original and current authors */
/** @author Dale Francis (dalefrancis88) */

const curry = require('../core/curry')
const isBichain = require('../core/isBichain')
const isFunction = require('../core/isFunction')

// bichain : bichain m => (e -> m c b) -> (a -> m c b) -> m e a -> m c b
function bichain(f, g, m) {
  if(!isFunction(f) || !isFunction(g)) {
    throw new TypeError('bichain: First two arguments must be Async returning functions')
  }

  if(!isBichain(m)) {
    throw new TypeError('bichain: Third argument must be a Bichain')
  }

  return m.bichain.call(m, f, g)
}

module.exports = curry(bichain)
