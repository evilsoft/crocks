/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import curry from '../core/curry'
import isPredOrFunc from '../core/isPredOrFunc'
import predOrFunc from '../core/predOrFunc'

// or : (a -> Boolean) | Pred -> (a -> Boolean) | Pred -> a -> Boolean
function or(f, g) {
  if(!(isPredOrFunc(f) && isPredOrFunc(g))) {
    throw new TypeError(
      'or: Preds or predicate functions required for first two arguments'
    )
  }

  return x =>
    !!(predOrFunc(f, x) || predOrFunc(g, x))
}

export default curry(or)
