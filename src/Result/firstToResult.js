/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import Result from './index'
import { proxy } from '../core/types'

import curry from '../core/curry'
import isFunction from '../core/isFunction'
import isSameType from '../core/isSameType'

const First = proxy('First')

const constant = x => () => x

const applyTransform = (left, first) =>
  first.valueOf().either(
    constant(Result.Err(left)),
    Result.Ok
  )

// firstToResult : c -> First a -> Result c a
// firstToResult : c -> (a -> First b) -> a -> Result c b
function firstToResult(left, first) {
  if(isFunction(first)) {
    return function(x) {
      const m = first(x)

      if(!isSameType(First, m)) {
        throw new TypeError('firstToResult: First returning function required for second argument')
      }

      return applyTransform(left, m)
    }
  }

  if(isSameType(First, first)) {
    return applyTransform(left, first)
  }

  throw new TypeError('firstToResult: First or First returning function required for second argument')
}

export default curry(firstToResult)
