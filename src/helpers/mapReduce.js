/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import curry from '../core/curry.js'
import isFoldable from '../core/isFoldable.js'
import isFunction from '../core/isFunction.js'

function mapReduce(mapFn, reduceFn, empty, xs) {
  if(!isFunction(mapFn)) {
    throw new TypeError('mapReduce: Unary mapping function required for first argument')
  }

  if(!isFunction(reduceFn)) {
    throw new TypeError('mapReduce: Binary reduction function required for second argument')
  }

  if(!isFoldable(xs)) {
    throw new TypeError('mapReduce: Foldable required for fourth argument')
  }

  return xs.reduce(
    (acc, x) => reduceFn(acc, mapFn(x)),
    empty
  )
}

export default curry(mapReduce)
