/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction = require('../predicates/isFunction')
const isSameType = require('../predicates/isSameType')

const Pred = require('../crocks/Pred')

const curry = require('../helpers/curry')
const identity = require('../combinators/identity')

const ifElse = require('./ifElse')

const predOrFunc =
  ifElse(isFunction, identity, x => x.runWith)

// or : (a -> Boolean) | Pred -> (a -> Boolean) | Pred -> a -> Boolean
function or(f, g) {
  if(!((isFunction(f) || isSameType(Pred, f)) && (isFunction(g) || isSameType(Pred, g)))) {
    throw new TypeError('or: Preds or predicate functions required for first two arguments')
  }

  return x => !!(predOrFunc(f, x) || predOrFunc(g, x))
}

module.exports = curry(or)
