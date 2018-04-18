/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import Either from './index.js'
import types from '../core/types.js'
const Maybe = types.proxy('Maybe')

import curry from '../core/curry.js'
import isFunction from '../core/isFunction.js'
import isSameType from '../core/isSameType.js'

const constant = x => () => x

const applyTransform = (left, maybe) =>
  maybe.either(
    constant(Either.Left(left)),
    Either.Right
  )

// maybeToEither : c -> Maybe a -> Either c a
// maybeToEither : c -> (a -> Maybe b) -> a -> Either c b
function maybeToEither(left, maybe) {
  if(isFunction(maybe)) {
    return function(x) {
      const m = maybe(x)

      if(!isSameType(Maybe, m)) {
        throw new TypeError('maybeToEither: Maybe returning function required for second argument')
      }

      return applyTransform(left, m)
    }
  }

  if(isSameType(Maybe, maybe)) {
    return applyTransform(left, maybe)
  }

  throw new TypeError('maybeToEither: Maybe or Maybe returning function required for second argument')
}

export default curry(maybeToEither)
