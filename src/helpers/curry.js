/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const _curry = require('../core/curry')
const isFunction = require('../core/isFunction')

/** curry :: ((a, b, c) -> d) -> a -> b -> c -> d */
function curry(fn) {
  if(!isFunction(fn)) {
    throw new TypeError('curry: Argument must be a Function')
  }

  return _curry(fn)
}

module.exports = curry
