/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../funcs/curry')
const isFunction = require('../internal/isFunction')

// Composition (Bluebird)
// composeB :: (b -> c) -> (a -> b) -> a -> c
function composeB(f, g, x) {
  if(!isFunction(f) || !isFunction(g)) {
    throw new TypeError('composeB: Functions required for first two arguments')
  }

  return f(g(x))
}

module.exports = curry(composeB)
