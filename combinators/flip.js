const curry       = require('../funcs/curry')
const isFunction  = require('../internal/isFunction')

// Flip (Cardinal)
//  flip :: (a -> b -> c) -> b -> a -> c
function flip(f, x, y) {
  if(!isFunction(f)) {
    throw new TypeError('flip: Function required for first arg')
  }

  return curry(f)(y, x)
}

module.exports = curry(flip)
