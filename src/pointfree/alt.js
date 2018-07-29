/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import curry from '../core/curry'
import fl from '../core/flNames'
import isAlt from '../core/isAlt'
import isSameType from '../core/isSameType'

// alt : Alt m => m a -> m a -> m a
function alt(m, x) {
  if(!(isAlt(m) && isSameType(m, x))) {
    throw new TypeError(
      'alt: Both arguments must be Alts of the same type'
    )
  }

  return (x[fl.alt] || x.alt).call(x, m)
}

export default curry(alt)
