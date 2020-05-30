/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const { Nothing, Just } = require('../core/Maybe')
const predOrFunc = require('../core/predOrFunc')

const curry = require('../core/curry')
const isPredOrFunc = require('../core/isPredOrFunc')

/** safe :: ((a -> Boolean) | Pred) -> a -> Maybe a */
function safe(pred, x) {
  if(!isPredOrFunc(pred)) {
    throw new TypeError('safe: Pred or predicate function required for first argument')
  }

  return predOrFunc(pred, x)
    ? Just(x)
    : Nothing()
}

module.exports = curry(safe)
