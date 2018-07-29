/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import { fold as _fold } from '../core/array'

import isArray from '../core/isArray'
import isFunction from '../core/isFunction'

// fold : Foldable f, Semigroup s => f s -> s
export default function fold(m) {
  if(isArray(m)) {
    return _fold(m)
  }

  if(m && isFunction(m.fold)) {
    return m.fold()
  }

  throw new TypeError('fold: Non-empty Foldable with at least one Semigroup is required')
}
