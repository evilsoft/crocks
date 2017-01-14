/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction = require('../predicates/isFunction')

const isType = require('../internal/isType')

const curry = require('./curry')

function unless(pred, f) {
  if(!(isFunction(pred) || isType('Pred', pred))) {
    throw new TypeError('unless: Pred or predicate function required for first argument')
  }

  if(!isFunction(f)) {
    throw new TypeError('unless: Function required for second argument')
  }

  const func = isFunction(pred)
    ? pred
    : pred.runWith

  return x => !func(x) ? f(x) : x
}

module.exports = curry(unless)
