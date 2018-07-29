/** @license ISC License (c) copyright 2018 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import curry from '../core/curry'
import isPredOrFunc from '../core/isPredOrFunc'
import predOrFunc from '../core/predOrFunc'

// implies :: (a -> Boolean) | Pred -> (a -> Boolean) -> a -> Boolean
function implies(p, q) {
  if(!(isPredOrFunc(p) && isPredOrFunc(q))) {
    throw new TypeError(
      'implies: Preds or predicate functions required for first two arguments'
    )
  }

  return x => !predOrFunc(p, x) || !!predOrFunc(q, x)
}

export default curry(implies)
