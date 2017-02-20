/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../helpers/curry')

const isFunction = require('../predicates/isFunction')
const isSameType = require('../predicates/isSameType')

const Pred = require('../crocks/Pred')
const predOrFunc = require('../internal/predOrFunc')

// filter : Foldable f => (a -> Boolean) -> f a -> f a
function filter(pred, m) {
  if(!(isFunction(pred) || isSameType(Pred, pred))) {
    throw new TypeError('filter: Pred or predicate function required for first argument')
  }
  else if(m && isFunction(m.filter)) {
    return m.filter(predOrFunc(pred))
  }

  throw new TypeError('filter: Foldable required for second argument')
}

module.exports = curry(filter)
