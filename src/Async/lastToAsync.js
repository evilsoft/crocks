/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import Async from './index.js'
import types from '../core/types.js'
const Last = types.proxy('Last')

import curry from '../core/curry.js'
import isFunction from '../core/isFunction.js'
import isSameType from '../core/isSameType.js'

const constant = x => () => x

const applyTransform = (left, last) =>
  last.valueOf().either(
    constant(Async.Rejected(left)),
    Async.Resolved
  )

// lastToAsync : e -> Last a -> Async e a
// lastToAsync : e -> (a -> Last b) -> a -> Async e b
function lastToAsync(left, last) {
  if(isFunction(last)) {
    return function(x) {
      const m = last(x)

      if(!isSameType(Last, m)) {
        throw new TypeError('lastToAsync: Last returning function required for second argument')
      }

      return applyTransform(left, m)
    }
  }

  if(isSameType(Last, last)) {
    return applyTransform(left, last)
  }

  throw new TypeError('lastToAsync: Last or Last returning function required for second argument')
}

export default curry(lastToAsync)
