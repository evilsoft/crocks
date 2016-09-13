/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../funcs/curry')
const isFunction = require('../internal/isFunction')

// Reverse Application (Thrush)
// reverseApply :: a -> (a -> b) -> b
function reverseApply(x, f) {
  if(!isFunction(f)) {
    throw new TypeError('reverseApply: Function required for second arg')
  }

  return f(x)
}

module.exports = curry(reverseApply)
