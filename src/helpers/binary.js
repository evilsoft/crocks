/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curryN = require('../core/curryN')
const isFunction = require('../core/isFunction')

/** binary :: (* -> c) -> a -> b -> c */
function binary(fn) {
  if(!isFunction(fn)) {
    throw new TypeError('binary: Argument must be a Function')
  }

  return curryN(2, fn)
}

module.exports = binary
