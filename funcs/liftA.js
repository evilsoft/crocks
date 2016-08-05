const curry       = require('../funcs/curry')
const isFunction  = require('../internal/isFunction')
const isApply     = require('../internal/isApply')

// liftA :: Applicative m => (a -> b) -> m a -> m b
function liftA(fn, m) {
  if(!isFunction(fn)) {
    throw new TypeError('liftA: Function required for first arg')
  }
  else if(!isApply(m)) {
    throw new TypeError('liftA: Apply required for second arg')
  }

  return m.map(fn)
}

module.exports = curry(liftA)
