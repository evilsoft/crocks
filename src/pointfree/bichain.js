/** @license ISC License (c) copyright 2018 original and current authors */
/** @author Dale Francis (dalefrancis88) */

const curry = require('../core/curry')
const isBichain = require('../core/isBichain')
const isFunction = require('../core/isFunction')

// bichain : bichain m => (e -> m c b) -> (a -> m c b) -> m e a -> m c b
function bichain(f, g, m) {
  if(!isFunction(f) || !isFunction(g)) {
    throw new TypeError('bichain: Functions required for first two arguments')
  }

  if(!isBichain(m)) {
    throw new TypeError('bichain: Bichain required for third argument')
  }

  return m.bichain.call(m, f, g)
}

module.exports = curry(bichain)
