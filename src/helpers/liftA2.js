/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import array from '../core/array.js'
import curry from '../core/curry.js'
import isApply from '../core/isApply.js'
import isArray from '../core/isArray.js'
import isFunction from '../core/isFunction.js'
import isSameType from '../core/isSameType.js'

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

export default curry(liftA2)
