const curry       = require('../funcs/curry')
const isFunction  = require('../internal/isFunction')

// Substitution (Starling)
// (a -> b -> c) -> (a -> b) -> a -> c
function substitution(f, g, x) {
  if(!isFunction(f) || !isFunction(g)) {
    throw new TypeError('substitution: Functions required for first two args')
  }

  return curry(f)(x, g(x))
}

module.exports = curry(substitution)
