const curry       = require('../funcs/curry')
const isFunction  = require('../internal/isFunction')
const composeB    = require('../combinators/composeB')

// map :: Functor f => (a -> b) -> f a -> f b
function map(fn, m) {
  if(!isFunction(fn)) {
    throw new TypeError('map: Function required for first arg')
  }
  else if(isFunction(m)) {
    return composeB(fn, m)
  }
  else if(m && isFunction(m.map)) {
    return m.map(fn)
  }
  else {
    throw new TypeError('map: Function or Functor of the same type required for second arg')
  }
}

module.exports = curry(map)
