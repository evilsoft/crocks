/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import curry from '../core/curry'
import isPredOrFunc from '../core/isPredOrFunc'
import predOrFunc from '../core/predOrFunc'

// not : (a -> Boolean) | Pred -> a -> Boolean
function not(pred, x) {
  if(!isPredOrFunc(pred)) {
    throw new TypeError(
      'not: Pred or predicate function required for first argument'
    )
  }

  return !predOrFunc(pred, x)
}

export default curry(not)
