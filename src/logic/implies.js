/** @license ISC License (c) copyright 2018 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../core/curry')
const isPredOrFunc = require('../core/isPredOrFunc')
const predOrFunc = require('../core/predOrFunc')

/** implies :: (a -> Boolean) | Pred -> (a -> Boolean) -> a -> Boolean */
function implies(p, q) {
  if(!(isPredOrFunc(p) && isPredOrFunc(q))) {
    throw new TypeError(
      'implies: Preds or predicate functions required for first two arguments'
    )
  }

  return x => !predOrFunc(p, x) || !!predOrFunc(q, x)
}

module.exports = curry(implies)
