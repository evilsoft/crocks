/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction = require('../internal/isFunction')
const isType = require('../internal/isType')
const curry = require('./curry')
const ifElse = require('./ifElse')

const Maybe = require('../crocks/Maybe')

const Nothing = Maybe.Nothing
const Just = Maybe.Just

function safe(pred) {
  if(!(isFunction(pred) || isType('Pred', pred))) {
    throw new TypeError('safe: Pred or predicate function required for first argument')
  }
  const fn = isFunction(pred)
    ? pred
    : pred.runWith

  return ifElse(fn, Just, Nothing)
}

module.exports = curry(safe)
