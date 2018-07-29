/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import Either from './index'
import { proxy } from '../core/types'

import curry from '../core/curry'
import isFunction from '../core/isFunction'
import isSameType from '../core/isSameType'

const First = proxy('First')

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
