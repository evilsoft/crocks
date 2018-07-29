/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import Async from './index'
import types from '../core/types'
const First = types.proxy('First')

import curry from '../core/curry'
import isFunction from '../core/isFunction'
import isSameType from '../core/isSameType'

const constant = x => () => x

const applyTransform = (left, first) =>
  first.valueOf().either(
    constant(Async.Rejected(left)),
    Async.Resolved
  )

// firstToAsync : e -> First a -> Async e a
// firstToAsync : e -> (a -> First b) -> a -> Async e b
function firstToAsync(left, first) {
  if(isFunction(first)) {
    return function(x) {
      const m = first(x)

      if(!isSameType(First, m)) {
        throw new TypeError('firstToAsync: First returning function required for second argument')
      }

      return applyTransform(left, m)
    }
  }

  if(isSameType(First, first)) {
    return applyTransform(left, first)
  }

  throw new TypeError('firstToAsync: First or First returning function required for second argument')
}

export default curry(firstToAsync)
