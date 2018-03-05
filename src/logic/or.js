/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const Pred = require('../core/types').proxy('Pred')

const curry = require('../core/curry')
const isFunction = require('../core/isFunction')
const isSameType = require('../core/isSameType')
const predOrFunc = require('../core/predOrFunc')

// or : (a -> Boolean) | Pred -> (a -> Boolean) | Pred -> a -> Boolean
function or(f, g) {
  if(!((isFunction(f) || isSameType(Pred, f)) && (isFunction(g) || isSameType(Pred, g)))) {
    throw new TypeError(
      'or: Preds or predicate functions required for first two arguments'
    )
  }

  return x =>
    !!(predOrFunc(f, x) || predOrFunc(g, x))
}

module.exports = curry(or)
