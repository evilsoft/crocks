/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../core/curry')
const predOrFunc = require('../core/predOrFunc')
const isPredOrFunc = require('../core/isPredOrFunc')
const isFunction = require('../core/isFunction')

// when : (a -> Boolean) | Pred -> (a -> b) -> a -> b | a
function when(pred, f) {
  if(!isPredOrFunc(pred)) {
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
