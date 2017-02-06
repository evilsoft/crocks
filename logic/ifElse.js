/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction = require('../predicates/isFunction')
const isSameType = require('../predicates/isSameType')

const Pred = require('../crocks/Pred')

const curry = require('../helpers/curry')

// ifElse : (a -> Boolean) | Pred -> (a -> b) -> (a -> c) -> a -> (a | c)
function ifElse(pred, f, g) {
  if(!(isFunction(pred) || isSameType(Pred, pred))) {
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
