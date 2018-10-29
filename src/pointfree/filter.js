/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../core/curry')

const isFunction = require('../core/isFunction')
const isPredOrFunc = require('../core/isPredOrFunc')
const isObject = require('../core/isObject')
const object = require('../core/object')
const predOrFunc = require('../core/predOrFunc')

// filter : Filterable f => (a -> Boolean) -> f a -> f a
function filter(pred, m) {
  if(!isPredOrFunc(pred)) {
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

  throw new TypeError('filter: Filterable or Object required for second argument')
}

module.exports = curry(filter)
