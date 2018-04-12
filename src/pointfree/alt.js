/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import curry from '../core/curry.js'
import isAlt from '../core/isAlt.js'
import isSameType from '../core/isSameType.js'

// alt : Alt m => m a -> m a -> m a
function alt(m, x) {
  if(!(isAlt(m) && isSameType(m, x))) {
    throw new TypeError(
      'alt: Both arguments must be Alts of the same type'
    )
  }

  return x.alt(m)
}

export default curry(alt)
