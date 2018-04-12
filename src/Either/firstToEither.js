/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import Either from './index.js'
import types from '../core/types.js'
const First = types.proxy('First')

import curry from '../core/curry.js'
import isFunction from '../core/isFunction.js'
import isSameType from '../core/isSameType.js'

const constant = x => () => x

const applyTransform = (left, first) =>
  first.valueOf().either(
    constant(Either.Left(left)),
    Either.Right
  )

// firstToEither : c -> First a -> Either c a
// firstToEither : c -> (a -> First b) -> a -> Either c b
function firstToEither(left, first) {
  if(isFunction(first)) {
    return function(x) {
      const m = first(x)

      if(!isSameType(First, m)) {
        throw new TypeError('firstToEither: First returning function required for second argument')
      }

      return applyTransform(left, m)
    }
  }

  if(isSameType(First, first)) {
    return applyTransform(left, first)
  }

  throw new TypeError('firstToEither: First or First returning function required for second argument')
}

export default curry(firstToEither)
