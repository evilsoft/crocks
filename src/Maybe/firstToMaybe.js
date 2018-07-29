/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import { proxy } from '../core/types'

import curry from '../core/curry'
import isFunction from '../core/isFunction'
import isSameType from '../core/isSameType'

const First = proxy('First')

const applyTransform = first =>
  first.valueOf()

// firstToMaybe : First a -> Maybe a
// firstToMaybe : (a -> First b) -> a -> Maybe b
function firstToMaybe(first) {
  if(isFunction(first)) {
    return function(x) {
      const m = first(x)

      if(!isSameType(First, m)) {
        throw new TypeError('firstToMaybe: First returning function required')
      }

      return applyTransform(m)
    }
  }

  if(isSameType(First, first)) {
    return applyTransform(first)
  }

  throw new TypeError('firstToMaybe: First or First returning function required')
}

export default curry(firstToMaybe)
