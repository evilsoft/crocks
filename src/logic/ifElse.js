/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../core/curry')
const isFunction = require('../core/isFunction')
const isPredOrFunc = require('../core/isPredOrFunc')
const predOrFunc = require('../core/predOrFunc')

// ifElse : (a -> Boolean) | Pred -> (a -> b) -> (a -> c) -> a -> (a | c)
function ifElse(pred, f, g) {
  if(!isPredOrFunc(pred)) {
    throw new TypeError(
      'ifElse: Pred or predicate function required for first argument'
    )
  }

  if(!(isFunction(f) && isFunction(g))) {
    throw new TypeError(
      'ifElse: Functions required for second and third arguments'
    )
  }

  return x => predOrFunc(pred, x) ? f(x) : g(x)
}

module.exports = curry(ifElse)
