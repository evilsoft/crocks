/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction = require('../internal/isFunction')
const curry = require('./curry')

function ifElse(pred, f, g) {
  if(!isFunction(pred)) {
    throw new TypeError('ifElse: Predicate function required for first argument')
  }

  if(!isFunction(f) || !isFunction(g)) {
    throw new TypeError('ifElse: Functions required for second and third arguments')
  }

  return x => !!pred(x) ? f(x) : g(x)
}

module.exports = curry(ifElse)
