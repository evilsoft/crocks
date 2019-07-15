/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curryN = require('../core/curryN')
const isFunction = require('../core/isFunction')

// unary : (* -> b) -> a -> b
function unary(fn) {
  if(!isFunction(fn)) {
    throw new TypeError('unary: Function required')
  }

  return curryN(1, fn)
}

module.exports = unary
