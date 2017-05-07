/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curryN = require('../internal/curryN')
const isFunction = require('../predicates/isFunction')

// binary : (* -> c) -> a -> b -> c
function binary(fn) {
  if(!isFunction(fn)) {
    throw new TypeError('binary: Function required')
  }

  return curryN(2, fn)
}

module.exports = binary
