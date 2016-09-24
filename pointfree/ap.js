/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../funcs/curry')
const isFunction = require('../internal/isFunction')

// ap :: Applicative m => m a -> m (a -> b) ->  m b
function ap(m, x) {
  if(!(m && isFunction(m.ap)) || !(m && isFunction(x.ap))) {
    throw new TypeError('ap: Both arguments must be Applys of the same type')
  }

  return x.ap(m)
}

module.exports = curry(ap)
