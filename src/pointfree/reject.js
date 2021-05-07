/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../core/curry')
const isArray = require('../core/isArray')
const isPredOrFunc = require('../core/isPredOrFunc')
const isFunction = require('../core/isFunction')
const isObject = require('../core/isObject')
const object = require('../core/object')
const predOrFunc = require('../core/predOrFunc')

const not =
  fn => x => !fn(x)

/** reject :: Foldable f => (a -> Boolean) -> f a -> f a */
function reject(pred, m) {
  if(!isPredOrFunc(pred)) {
    throw new TypeError(
      'reject: Pred or predicate function required for first argument'
    )
  }

  const fn =
    x => predOrFunc(pred, x)

  if(m && isFunction(m.reject)) {
    return m.reject(fn)
  }

  if(isArray(m)) {
    return m.filter(not(fn))
  }

  if(isObject(m)) {
    return object.filter(not(fn), m)
  }

  throw new TypeError('reject: Foldable or Object required for second argument')
}

module.exports = curry(reject)
