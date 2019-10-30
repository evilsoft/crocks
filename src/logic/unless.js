/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../core/curry')
const isPredOrFunc = require('../core/isPredOrFunc')
const isFunction = require('../core/isFunction')
const predOrFunc = require('../core/predOrFunc')

/** unless :: (a -> Boolean) | Pred -> (a -> b) -> a | b */
function unless(pred, f) {
  if(!isPredOrFunc(pred)) {
    throw new TypeError(
      'unless: Pred or predicate function required for first argument'
    )
  }

  if(!isFunction(f)) {
    throw new TypeError(
      'unless: Function required for second argument'
    )
  }

  return x =>
    !predOrFunc(pred, x) ? f(x) : x
}

module.exports = curry(unless)
