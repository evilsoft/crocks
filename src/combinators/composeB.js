/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const compose = require('../core/compose')
const curry = require('../core/curry')
const isFunction = require('../core/isFunction')

// Composition (Bluebird)
// composeB :: (b -> c) -> (a -> b) -> a -> c
function composeB(f, g) {
  if(!isFunction(f) || !isFunction(g)) {
    throw new TypeError('composeB: Functions required for first two arguments')
  }

  return compose(f, g)
}

module.exports = curry(composeB)
