const curry = require('../funcs/curry')

const helpers     = require('../internal/helpers')
const isFunction  = helpers.isFunction

// Reverse Application (Thrush)
// t_comb :: a -> (a -> b) -> b
function t_comb(x, f) {
  if(!isFunction(f)) {
    throw new TypeError('t_comb takes a function for the second argument')
  }

  return f(x)
}

module.exports = curry(t_comb)
