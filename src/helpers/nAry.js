/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import curry from '../core/curry'
import curryN from '../core/curryN'
import isFunction from '../core/isFunction'
import isNumber from '../core/isNumber'

// nAry : Number -> (* -> a) -> * -> * -> a
function nAry(num, fn) {
  if(!isNumber(num)) {
    throw new TypeError('nAry: Number required for first argument')
  }

  if(!isFunction(fn)) {
    throw new TypeError('nAry: Function required for second argument')
  }

  return curryN(num, fn)
}

export default curry(nAry)
