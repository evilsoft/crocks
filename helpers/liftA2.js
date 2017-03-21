/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isApply = require('../predicates/isApply')
const isArray = require('../predicates/isArray')
const isFunction = require('../predicates/isFunction')
const isSameType = require('../predicates/isSameType')

const array = require('../internal/array')

const map = array.map
const ap = array.ap

const curry = require('./curry')

// liftA2 :: Applicative m => (a -> b -> c) -> m a -> m b -> m c
function liftA2(fn, x, y) {
  if(!isFunction(fn)) {
    throw new TypeError('liftA2: Function required for first argument')
  }
  else if(!((isApply(x) || isArray(x)) && isSameType(x, y))) {
    throw new TypeError('liftA2: Applys of same type required for last two arguments')
  }

  if(isArray(x)) {
    return ap(y, map(fn, x))
  }

  return x.map(fn).ap(y)
}

module.exports = curry(liftA2)
