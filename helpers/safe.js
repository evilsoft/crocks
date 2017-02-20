/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction = require('../predicates/isFunction')
const isSameType = require('../predicates/isSameType')

const curry = require('./curry')
const ifElse = require('../logic/ifElse')

const Maybe = require('../crocks/Maybe')
const Pred = require('../crocks/Pred')
const predOrFunc = require('../internal/predOrFunc')

const Nothing = Maybe.Nothing
const Just = Maybe.Just

// safe : ((a -> Boolean) | Pred) -> a -> Maybe a
function safe(pred) {
  if(!(isFunction(pred) || isSameType(Pred, pred))) {
    throw new TypeError('safe: Pred or predicate function required for first argument')
  }

  return ifElse(predOrFunc(pred), Just, Nothing)
}

module.exports = curry(safe)
