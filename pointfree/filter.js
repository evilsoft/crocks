/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../helpers/curry')

const isFunction = require('../predicates/isFunction')
const isObject = require('../predicates/isObject')
const isSameType = require('../predicates/isSameType')

const Pred = require('../crocks/Pred')
const predOrFunc = require('../internal/predOrFunc')

const object = require('../internal/object')

// filter : Foldable f => (a -> Boolean) -> f a -> f a
function filter(pred, m) {
  if(!(isFunction(pred) || isSameType(Pred, pred))) {
    throw new TypeError('filter: Pred or predicate function required for first argument')
  }
  const fn = predOrFunc(pred)

  if(m && isFunction(m.filter)) {
    return m.filter(fn)
  }
  else if(m && isObject(m)) {
    return object.filter(fn, m)
  }

  throw new TypeError('filter: Foldable or Object required for second argument')
}

module.exports = curry(filter)
