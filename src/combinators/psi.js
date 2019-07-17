/** @license ISC License (c) copyright 2019 original and current authors */
/** @author Dale Francis (dalefrancis88) */

const curry = require('../core/curry')
const isFunction = require('../core/isFunction')

// PSI (P)
// psi :: (b -> b -> c) -> (a -> b) -> a -> a -> c
function psi(f, g, x, y) {
  if(!isFunction(f) || !isFunction(g)) {
    throw new TypeError('psi: First and second arguments must be functions')
  }

  return curry(f)(g(x), g(y))
}

module.exports = curry(psi)
