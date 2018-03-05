/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const Pred = require('../core/types').proxy('Pred')

const curry = require('../core/curry')
const predOrFunc = require('../core/predOrFunc')
const isFunction = require('../core/isFunction')
const isSameType = require('../core/isSameType')

// when : (a -> Boolean) | Pred -> (a -> b) -> a -> b | a
function when(pred, f) {
  if(!(isFunction(pred) || isSameType(Pred, pred))) {
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

module.exports = curry(when)
