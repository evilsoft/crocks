/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const Pred = require('../core/types').proxy('Pred')

const compose = require('../core/compose')
const curry = require('../core/curry')
const isFunction = require('../core/isFunction')
const isSameType = require('../core/isSameType')
const safe = require('./safe')

const map =
  fn => m => m.map(fn)

// safeLift : ((a -> Boolean) | Pred) -> (a -> b) -> a -> Maybe b
function safeLift(pred, fn) {
  if(!(isFunction(pred) || isSameType(Pred, pred))) {
    throw new TypeError('safeLift: Pred or predicate function required for first argument')
  }
  else if(!isFunction(fn)) {
    throw new TypeError('safeLift: Function required for second argument')
  }

  return compose(map(fn), safe(pred))
}

module.exports = curry(safeLift)
