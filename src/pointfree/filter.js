/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const Pred = require('../core/types').proxy('Pred')

const curry = require('../core/curry')
const isFunction = require('../core/isFunction')
const isObject = require('../core/isObject')
const isSameType = require('../core/isSameType')
const object = require('../core/object')
const predOrFunc = require('../core/predOrFunc')

// filter : Foldable f => (a -> Boolean) -> f a -> f a
function filter(pred, m) {
  if(!(isFunction(pred) || isSameType(Pred, pred))) {
    throw new TypeError('filter: Pred or predicate function required for first argument')
  }
  const fn =
    x => predOrFunc(pred, x)

  if(m && isFunction(m.filter)) {
    return m.filter(fn)
  }

  if(m && isObject(m)) {
    return object.filter(fn, m)
  }

  throw new TypeError('filter: Foldable or Object required for second argument')
}

module.exports = curry(filter)
