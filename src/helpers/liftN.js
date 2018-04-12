/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import array from '../core/array.js'
import curry from '../core/curry.js'
import curryN from '../core/curryN.js'

import isApply from '../core/isApply.js'
import isArray from '../core/isArray.js'
import isFunction from '../core/isFunction.js'
import isFunctor from '../core/isFunctor.js'
import isInteger from '../core/isInteger.js'
import isSameType from '../core/isSameType.js'

const ap = array.ap

const applyAp = (x, y) => {
  if(!(isSameType(x, y) && (isArray(y) || isApply(y)))) {
    throw new TypeError('liftN: Applys of same type are required')
  }

  if(isArray(x)) {
    return ap(y, x)
  }

  return x.ap(y)
}

function liftN(n, fn) {
  if(!isInteger(n)) {
    throw new TypeError('liftN: Integer required for first argument')
  }

  if(!isFunction(fn)) {
    throw new TypeError('liftN: Function required for second argument')
  }

  return curryN(n, function(...args) {
    if(!isFunctor(args[0])) {
      throw new TypeError('liftN: Applys of same type are required')
    }

    return args.slice(1, n).reduce(
      applyAp,
      args[0].map(x => curryN(n, fn)(x))
    )
  })
}

export default curry(liftN)
