/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction = require('../predicates/isFunction')
const isSameType = require('../predicates/isSameType')

const Pred = require('../crocks/Pred')
const predOrFunc = require('../internal/predOrFunc')

const identity = require('../combinators/identity')
const ifElse = require('./ifElse')
const not = require('./not')

const curry = require('../helpers/curry')

// unless : (a -> Boolean) | Pred -> (a -> b) -> a | b
function unless(pred, f) {
  if(!(isFunction(pred) || isSameType(Pred, pred))) {
    throw new TypeError('unless: Pred or predicate function required for first argument')
  }

  if(!isFunction(f)) {
    throw new TypeError('unless: Function required for second argument')
  }

  return ifElse(not(predOrFunc(pred)), f, identity)
}

module.exports = curry(unless)
