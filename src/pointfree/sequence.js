/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import array from '../core/array'
import curry from '../core/curry'
import isArray from '../core/isArray'
import isApplicative from '../core/isApplicative'
import isFunction from '../core/isFunction'

function sequence(af, m) {
  if(!(isApplicative(af) || isFunction(af))) {
    throw new TypeError(
      'sequence: Applicative TypeRep or Apply returning function required for first argument'
    )
  }

  if(m && isFunction(m.sequence)) {
    return m.sequence(af)
  }

  if(isArray(m)) {
    return array.sequence(af, m)
  }

  throw new TypeError('sequence: Traversable or Array required for second argument')
}

export default curry(sequence)
