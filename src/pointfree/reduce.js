/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import curry from '../core/curry.js'
import isFoldable from '../core/isFoldable.js'
import isFunction from '../core/isFunction.js'

function reduce(fn, init, m) {
  if(!isFunction(fn)) {
    throw new TypeError(
      'reduce: Function required for first argument'
    )
  }

  if(!isFoldable(m)) {
    throw new TypeError(
      'reduce: Foldable required for third argument'
    )
  }

  return m.reduce(fn, init)
}

export default curry(reduce)
