/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const array = require('../core/array')
const curry = require('../core/curry')
const isApply = require('../core/isApply')
const isArray = require('../core/isArray')
const isFunction = require('../core/isFunction')
const isSameType = require('../core/isSameType')

const map = array.map
const ap = array.ap

// liftA2 :: Applicative m => (a -> b -> c) -> m a -> m b -> m c
function liftA2(fn, x, y) {
  if(!isFunction(fn)) {
    throw new TypeError('liftA2: Function required for first argument')
  }

  if(!((isApply(x) || isArray(x)) && isSameType(x, y))) {
    throw new TypeError('liftA2: Applys of same type required for last two arguments')
  }

  if(isArray(x)) {
    return ap(y, map(fn, x))
  }

  return x.map(fn).ap(y)
}

module.exports = curry(liftA2)
