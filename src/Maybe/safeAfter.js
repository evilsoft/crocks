const { Just, Nothing } = require('../core/Maybe')

import curry from '../core/curry.js'
import isPredOrFunc from '../core/isPredOrFunc.js'
import isFunction from '../core/isFunction.js'
import predOrFunc from '../core/predOrFunc.js'

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
