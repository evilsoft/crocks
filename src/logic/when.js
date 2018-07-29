/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import curry from '../core/curry'
import predOrFunc from '../core/predOrFunc'
import isPredOrFunc from '../core/isPredOrFunc'
import isFunction from '../core/isFunction'

// when : (a -> Boolean) | Pred -> (a -> b) -> a -> b | a
function when(pred, f) {
  if(!isPredOrFunc(pred)) {
    throw new TypeError(
      'when: Pred or predicate function required for first argument'
    )
  }

  if(!isFunction(f)) {
    throw new TypeError(
      'when: Function required for second argument'
    )
  }

  return x =>
    predOrFunc(pred, x) ? f(x) : x
}

export default curry(when)
