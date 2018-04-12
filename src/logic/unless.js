/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import curry from '../core/curry.js'
import isPredOrFunc from '../core/isPredOrFunc.js'
import isFunction from '../core/isFunction.js'
import predOrFunc from '../core/predOrFunc.js'

// unless : (a -> Boolean) | Pred -> (a -> b) -> a | b
function unless(pred, f) {
  if(!isPredOrFunc(pred)) {
    throw new TypeError(
      'unless: Pred or predicate function required for first argument'
    )
  }

  if(!isFunction(f)) {
    throw new TypeError(
      'unless: Function required for second argument'
    )
  }

  return x =>
    !predOrFunc(pred, x) ? f(x) : x
}

export default curry(unless)
