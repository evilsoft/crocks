/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import curry from '../core/curry.js'
import isFunction from '../core/isFunction.js'

function swap(f, g, m) {
  if(!(isFunction(f) && isFunction(g))) {
    throw new TypeError(
      'swap: Function required for first two arguments'
    )
  }

  if(m && isFunction(m.swap)) {
    return m.swap(f, g)
  }

  throw new TypeError(
    'swap: Async, Either, Pair or Result required for third arguments'
  )
}

export default curry(swap)
