/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import compose from '../core/compose.js'
import curry from '../core/curry.js'
import isPredOrFunc from '../core/isPredOrFunc.js'
import isFunction from '../core/isFunction.js'
import safe from './safe.js'

const map =
  fn => m => m.map(fn)

// safeLift : ((a -> Boolean) | Pred) -> (a -> b) -> a -> Maybe b
function safeLift(pred, fn) {
  if(!isPredOrFunc(pred)) {
    throw new TypeError('safeLift: Pred or predicate function required for first argument')
  }
  else if(!isFunction(fn)) {
    throw new TypeError('safeLift: Function required for second argument')
  }

  return compose(map(fn), safe(pred))
}

export default curry(safeLift)
