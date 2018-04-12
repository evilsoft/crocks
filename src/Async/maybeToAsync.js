/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import Async from './index.js'
import types from '../core/types.js'
const Maybe = types.proxy('Maybe')

import curry from '../core/curry.js'
import isFunction from '../core/isFunction.js'
import isSameType from '../core/isSameType.js'

const constant = x => () => x

const applyTransform = (left, maybe) =>
  maybe.either(
    constant(Async.Rejected(left)),
    Async.Resolved
  )

// maybeToAsync : e -> Maybe a -> Async e a
// maybeToAsync : e -> (a -> Maybe b) -> a -> Async e b
function maybeToAsync(left, maybe) {
  if(isFunction(maybe)) {
    return function(x) {
      const m = maybe(x)

      if(!isSameType(Maybe, m)) {
        throw new TypeError('maybeToAsync: Maybe returning function required for second argument')
      }

      return applyTransform(left, m)
    }
  }

  if(isSameType(Maybe, maybe)) {
    return applyTransform(left, maybe)
  }

  throw new TypeError('maybeToAsync: Maybe or Maybe returning function required for second argument')
}

export default curry(maybeToAsync)
