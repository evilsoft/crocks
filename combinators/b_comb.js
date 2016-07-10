const curry       = require('../funcs/curry')
const isFunction  = require('../internal/isFunction')

// Composition (Bluebird)
// b_comb :: (b -> c) -> (a -> b) -> a -> c
function b_comb(f, g, x) {
  if(!isFunction(f) || !isFunction(g)) {
    throw new TypeError('b_comb takes a function for the first two arguments')
  }

  return f(g(x))
}

module.exports = curry(b_comb)
