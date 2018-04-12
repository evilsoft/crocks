/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import types from '../core/types.js'
const First = types.proxy('First')

import curry from '../core/curry.js'
import isFunction from '../core/isFunction.js'
import isSameType from '../core/isSameType.js'

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
