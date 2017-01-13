/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isApply = require('../predicates/isApply')
const isFunction = require('../predicates/isFunction')

const curry = require('./curry')

// liftA2 :: Applicative m => (a -> b -> c) -> m a -> m b -> m c
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
