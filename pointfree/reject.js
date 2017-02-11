/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../helpers/curry')

const ifElse = require('../logic/ifElse')
const isArray = require('../predicates/isArray')
const isFunction = require('../predicates/isFunction')
const isSameType = require('../predicates/isSameType')
const not = require('../logic/not')

const identity = require('../combinators/identity')

const Pred = require('../crocks/Pred')

// reject : Foldable f => (a -> Boolean) -> f a -> f a
function reject(pred, m) {
  if(!(isFunction(pred) || isSameType(Pred, pred))) {
    throw new TypeError('reject: Pred or predicate function required for first argument')
  }

  const fn =
    ifElse(isFunction, identity, p => p.runWith, pred)

  if(isArray(m)) {
    return m.filter(not(fn))
  }
  else if(m && isFunction(m.reject)) {
    return m.reject(fn)
  }
  else {
    throw new TypeError('reject: Foldable required for second argument')
  }
}

module.exports = curry(reject)
