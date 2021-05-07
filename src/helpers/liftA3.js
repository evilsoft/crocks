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

/** liftA3 :: Applicative m => (a -> b -> c -> d) -> m a -> m b -> m c -> m d */
function liftA3(fn, x, y, z) {
  if(!isFunction(fn)) {
    throw new TypeError('liftA3: Function required for first argument')
  }
  else if(!((isApply(x) || isArray(x)) && isSameType(x, y) && isSameType(x, z))) {
    throw new TypeError('liftA3: Applys of same type required for last three arguments')
  }

  if(isArray(x)) {
    return ap(z, ap(y, map(fn, x)))
  }

  return x.map(fn).ap(y).ap(z)
}

module.exports = curry(liftA3)
