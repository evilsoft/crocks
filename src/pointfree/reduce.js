/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import curry from '../core/curry'
import isFoldable from '../core/isFoldable'
import isFunction from '../core/isFunction'
import fl from '../core/flNames'

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

  return (m[fl.reduce] || m.reduce).call(m, fn, init)
}

export default curry(reduce)
