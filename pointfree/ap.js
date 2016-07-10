const curry       = require('../funcs/curry')
const isFunction  = require('../internal/isFunction')

// ap :: Applicative m => m a -> m (a -> b) ->  m b
function ap(m, x) {
  if(!isFunction(m.ap) || !isFunction(x.ap)) {
    throw new TypeError('Both args to ap must be Applys of the same type')
  }

  return x.ap(m)
}

module.exports = curry(ap)
