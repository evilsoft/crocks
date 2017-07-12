/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const Pred = require('../core/Pred')
const curry = require('../core/curry')
const isFunction = require('../core/isFunction')
const isSameType = require('../core/isSameType')
const predOrFunc = require('../core/predOrFunc')

// unless : (a -> Boolean) | Pred -> (a -> b) -> a | b
function unless(pred, f) {
  if(!(isFunction(pred) || isSameType(Pred, pred))) {
    throw new TypeError('unless: Pred or predicate function required for first argument')
  }

  if(!isFunction(f)) {
    throw new TypeError('unless: Function required for second argument')
  }

  return function(x) {
    if(!predOrFunc(pred, x)) {
      return f(x)
    }
    return x
  }
}

module.exports = curry(unless)
