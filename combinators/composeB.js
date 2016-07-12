const curry       = require('../funcs/curry')
const isFunction  = require('../internal/isFunction')

// Composition (Bluebird)
// composeB :: (b -> c) -> (a -> b) -> a -> c
function composeB(f, g, x) {
  if(!isFunction(f) || !isFunction(g)) {
    throw new TypeError('composeB: first two arguments must be functions')
  }

  return f(g(x))
}

module.exports = curry(composeB)
