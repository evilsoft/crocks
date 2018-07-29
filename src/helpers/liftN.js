/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import { ap } from '../core/array'
import curry from '../core/curry'
import curryN from '../core/curryN'

import isApply from '../core/isApply'
import isArray from '../core/isArray'
import isFunction from '../core/isFunction'
import isFunctor from '../core/isFunctor'
import isInteger from '../core/isInteger'
import isSameType from '../core/isSameType'

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
