const Pred = require('../core/types').proxy('Pred')
const Maybe = require('../core/Maybe')

const curry = require('../core/curry')
const isFunction = require('../core/isFunction')
const predOrFunc = require('../core/predOrFunc')
const isSameType = require('../core/isSameType')
const { Just, Nothing } = Maybe

// safeAfter :: ((b -> Boolean) | Pred) -> (a -> b) -> a -> Maybe b
function safeAfter(pred, fn) {
  if(!(isFunction(pred) || isSameType(Pred, pred))) {
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

module.exports = curry(safeAfter)
