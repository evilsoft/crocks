/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const _safe = require('./core/safe')
const Pred = require('./core/Pred')
const curry = require('./core/curry')
const isFunction = require('./core/isFunction')
const isSameType = require('./core/isSameType')

// safe : ((a -> Boolean) | Pred) -> a -> Maybe a
function safe(pred, x) {
  if(!(isFunction(pred) || isSameType(Pred, pred))) {
    throw new TypeError('safe: Pred or predicate function required for first argument')
  }

  return _safe(pred)(x)
}

module.exports = curry(safe)
