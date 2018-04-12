/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import curry from '../core/curry.js'
import isPredOrFunc from '../core/isPredOrFunc.js'
import predOrFunc from '../core/predOrFunc.js'

// and : (a -> Boolean) | Pred -> (a -> Boolean) | Pred -> a -> Boolean
function and(f, g) {
  if(!(isPredOrFunc(f) && isPredOrFunc(g))) {
    throw new TypeError(
      'and: Preds or predicate functions required for first two arguments'
    )
  }

  return x => !!(predOrFunc(f, x) && predOrFunc(g, x))
}

export default curry(and)
