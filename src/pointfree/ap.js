/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import array from '../core/array'
import curry from '../core/curry'
import isApplicative from '../core/isApplicative'
import isArray from '../core/isArray'
import isSameType from '../core/isSameType'

// ap :: Applicative m => m a -> m (a -> b) ->  m b
function ap(m, x) {
  if(!((isApplicative(m) || isArray(m)) && isSameType(m, x))) {
    throw new TypeError('ap: Both arguments must be Applys of the same type')
  }

  if(isArray(x)) {
    return array.ap(m, x)
  }

  return x.ap(m)
}

export default curry(ap)
