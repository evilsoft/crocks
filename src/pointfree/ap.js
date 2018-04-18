/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import array from '../core/array.js'
import curry from '../core/curry.js'
import isApplicative from '../core/isApplicative.js'
import isArray from '../core/isArray.js'
import isSameType from '../core/isSameType.js'

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
