/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction = require('../internal/isFunction')
const curry = require('./curry')

function unless(pred, f) {
  if(!isFunction(pred)) {
    throw new TypeError('unless: Predicate function required for first argument')
  }

  if(!isFunction(f)) {
    throw new TypeError('unless: Function required for second argument')
  }

  return x => !pred(x) ? f(x) : x
}

module.exports = curry(unless)
