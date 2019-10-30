/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const compose = require('../core/compose')
const curry = require('../core/curry')
const isPredOrFunc = require('../core/isPredOrFunc')
const isFunction = require('../core/isFunction')
const safe = require('./safe')

const map =
  fn => m => m.map(fn)

/** safeLift :: ((a -> Boolean) | Pred) -> (a -> b) -> a -> Maybe b */
function safeLift(pred, fn) {
  if(!isPredOrFunc(pred)) {
    throw new TypeError('safeLift: Pred or predicate function required for first argument')
  }
  else if(!isFunction(fn)) {
    throw new TypeError('safeLift: Function required for second argument')
  }

  return compose(map(fn), safe(pred))
}

module.exports = curry(safeLift)
