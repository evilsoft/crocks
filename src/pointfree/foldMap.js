/** @license ISC License (c) copyright 2018 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import _array from '../core/array'

import curry from '../core/curry'
import isArray from '../core/isArray'
import isFunction from '../core/isFunction'

// foldMap :: Foldable f, Semigroup s => (a -> s) -> f a -> s
function foldMap(fn, m) {
  if(!isFunction(fn)) {
    throw new TypeError(
      'foldMap: Function returning Semigroups of the same type required for first argument'
    )
  }

  if(isArray(m)) {
    return _array.foldMap(fn, m)
  }

  if(m && isFunction(m.foldMap)) {
    return m.foldMap(fn)
  }

  throw new TypeError(
    'foldMap: Non-empty Foldable with at least one Semigroup required for second argument'
  )
}

export default curry(foldMap)
