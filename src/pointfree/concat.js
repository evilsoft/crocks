/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import curry from '../core/curry.js'
import isSameType from '../core/isSameType.js'
import isSemigroup from '../core/isSemigroup.js'
import isString from '../core/isString.js'

function concat(x, m) {
  if(!(isSemigroup(m) && isSameType(x, m))) {
    throw new TypeError(
      'concat: Semigroups of the same type required both arguments'
    )
  }

  if(isString(m)) {
    return m + x
  }

  return m.concat(x)
}

export default curry(concat)
