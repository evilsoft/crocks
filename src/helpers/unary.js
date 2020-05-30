/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction = require('../core/isFunction')

/** unary :: (* -> b) -> a -> b */
function unary(fn) {
  if(!isFunction(fn)) {
    throw new TypeError('unary: Argument must be a Function')
  }

  return function(x) {
    return fn(x)
  }
}

module.exports = unary
