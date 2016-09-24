/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('./curry')
const isApply = require('../internal/isApply')
const isFunction = require('../internal/isFunction')

// liftA3 :: Applicative m => (a -> a -> a -> b) -> m a -> m a -> m a -> m b
function liftA3(fn, x, y, z) {
  if(!isFunction(fn)) {
    throw new TypeError('liftA3: Function required for first argument')
  }
  else if(!isApply(x) || !isApply(y) || !isApply(z)) {
    throw new TypeError('liftA3: Applys required for last three arguments')
  }

  return x.map(fn).ap(y).ap(z)
}

module.exports = curry(liftA3)
