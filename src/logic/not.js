/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../core/curry')
const isPredOrFunc = require('../core/isPredOrFunc')
const predOrFunc = require('../core/predOrFunc')

// not : (a -> Boolean) | Pred -> a -> Boolean
function not(pred, x) {
  if(!isPredOrFunc(pred)) {
    throw new TypeError(
      'not: Pred or predicate function required for first argument'
    )
  }

  return !predOrFunc(pred, x)
}

module.exports = curry(not)
