/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('./curry')
const isApply = require('../internal/isApply')
const isFunction = require('../internal/isFunction')

// liftA2 :: Applicative m => (a -> a -> b) -> m a -> m a -> m b
function liftA2(fn, x, y) {
  if(!isFunction(fn)) {
    throw new TypeError('liftA2: Function required for first argument')
  }
  else if(!isApply(x) || !isApply(y)) {
    throw new TypeError('liftA2: Applys required for last two arguments')
  }

  return x.map(fn).ap(y)
}

module.exports = curry(liftA2)
