/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */


const Pred = require('./Pred')
const curry = require('./core/curry')
const isFunction = require('./core/isFunction')
const isSameType = require('./core/isSameType')
const predOrFunc = require('./core/predOrFunc')

// not : (a -> Boolean) | Pred -> a -> Boolean
function not(pred, x) {
  if(!(isFunction(pred) || isSameType(Pred, pred))) {
    throw new TypeError('not: Pred or predicate function required for first argument')
  }

  return !predOrFunc(pred, x)
}

module.exports = curry(not)
