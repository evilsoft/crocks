import { Just, Nothing } from '../core/Maybe'

import curry from '../core/curry'
import isPredOrFunc from '../core/isPredOrFunc'
import isFunction from '../core/isFunction'
import predOrFunc from '../core/predOrFunc'

// safeAfter :: ((b -> Boolean) | Pred) -> (a -> b) -> a -> Maybe b
function safeAfter(pred, fn) {
  if(!isPredOrFunc(pred)) {
    throw new TypeError('safeAfter: Pred or predicate function required for first argument')
  }
  if(!isFunction(fn)) {
    throw new TypeError('safeAfter: Function required for second argument')
  }

  return x => {
    const result = fn(x)
    return predOrFunc(pred, result)
      ? Just(result)
      : Nothing()
  }
}

export default curry(safeAfter)
