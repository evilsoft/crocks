/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import Maybe from '../core/Maybe'
const { Nothing, Just } = Maybe
import predOrFunc from '../core/predOrFunc'

import curry from '../core/curry'
import isPredOrFunc from '../core/isPredOrFunc'

// safe : ((a -> Boolean) | Pred) -> a -> Maybe a
function safe(pred, x) {
  if(!isPredOrFunc(pred)) {
    throw new TypeError('safe: Pred or predicate function required for first argument')
  }

  return predOrFunc(pred, x)
    ? Just(x)
    : Nothing()
}

export default curry(safe)
