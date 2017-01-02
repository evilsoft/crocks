/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction = require('../internal/isFunction')
const isType = require('../internal/isType')
const curry = require('./curry')

function ifElse(pred, f, g) {
  if(!(isFunction(pred) || isType('Pred', pred))) {
    throw new TypeError('ifElse: Pred or predicate function required for first argument')
  }

  if(!isFunction(f) || !isFunction(g)) {
    throw new TypeError('ifElse: Functions required for second and third arguments')
  }

  const func = isFunction(pred)
    ? pred
    : pred.runWith

  return x => !!func(x) ? f(x) : g(x)
}

module.exports = curry(ifElse)
