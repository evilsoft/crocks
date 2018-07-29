/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import curry from '../core/curry'
import isSameType from '../core/isSameType'
import isSemigroup from '../core/isSemigroup'
import fl from '../core/flNames'

function concat(x, m) {
  if(!(isSemigroup(m) && isSameType(x, m))) {
    throw new TypeError(
      'concat: Semigroups of the same type required for both arguments'
    )
  }

  return (m[fl.concat] || m.concat).call(m, x)
}

export default curry(concat)
