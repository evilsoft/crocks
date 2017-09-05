/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const Pred = require('../core/types').proxy('Pred')
const { Nothing, Just } = require('../core/Maybe')
const predOrFunc = require('../core/predOrFunc')

const curry = require('../core/curry')
const isFunction = require('../core/isFunction')
const isSameType = require('../core/isSameType')

// safe : ((a -> Boolean) | Pred) -> a -> Maybe a
function safe(pred, x) {
  if(!(isFunction(pred) || isSameType(Pred, pred))) {
    throw new TypeError('safe: Pred or predicate function required for first argument')
  }

  return predOrFunc(pred, x)
    ? Just(x)
    : Nothing()
}

module.exports = curry(safe)
