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

// liftA3 :: Applicative m => (a -> b -> c -> d) -> m a -> m b -> m c -> m d
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

export default curry(liftA3)
