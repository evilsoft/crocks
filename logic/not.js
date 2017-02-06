/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../helpers/curry')

const isFunction = require('../predicates/isFunction')
const isSameType = require('../predicates/isSameType')

const Pred = require('../crocks/Pred')

// not : (a -> Boolean) | Pred -> a -> Boolean
function not(pred, x) {
  if(!(isFunction(pred) || isSameType(Pred, pred))) {
    throw new TypeError('not: Pred or predicate function required for first argument')
  }

  const func = isFunction(pred)
    ? pred
    : pred.runWith

  return !func(x)
}

module.exports = curry(not)
