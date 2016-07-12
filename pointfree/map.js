const curry       = require('../funcs/curry')
const isFunction  = require('../internal/isFunction')
const composeB    = require('../combinators/composeB')

// map :: Functor f => (a -> b) -> f a -> f b
function map(fn, m) {
  if(!isFunction(fn)) {
    throw new TypeError('first arg to map must be a function')
  }

  if(isFunction(m)) {
    return composeB(fn, m)
  } else if(m && isFunction(m.map)) {
    return m.map(fn)
  } else {
    throw new TypeError('second arg to map must be a function or Functor of the same type')
  }
}

module.exports = curry(map)
