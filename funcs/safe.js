/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction = require('../internal/isFunction')
const curry = require('./curry')

const Maybe = require('../crocks/Maybe')

const Nothing = Maybe.Nothing
const Just = Maybe.Just

function safe(pred) {
  if(!isFunction(pred)) {
    throw new TypeError('safe: Predicate function required for first argument')
  }

  return x => !!pred(x) ? Just(x) : Nothing()
}

module.exports = curry(safe)
