/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../helpers/curry')
const isFunction = require('../internal/isFunction')
const isType = require('../internal/isType')

// filter :: Foldable f => (a -> Boolean) -> f a -> f a
function filter(pred, m) {
  if(!(isFunction(pred) || isType('Pred', pred))) {
    throw new TypeError('filter: Pred or predicate function required for first argument')
  }
  else if(m && isFunction(m.filter)) {

    const fn = isFunction(pred)
      ? pred
      : pred.runWith

    return m.filter(fn)
  }
  else {
    throw new TypeError('filter: Foldable of the same type required for second argument')
  }
}

module.exports = curry(filter)
