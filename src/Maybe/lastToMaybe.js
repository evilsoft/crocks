/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import { proxy } from '../core/types'

import curry from '../core/curry'
import isFunction from '../core/isFunction'
import isSameType from '../core/isSameType'

const Last = proxy('Last')

const applyTransform = last =>
  last.valueOf()

// lastToMaybe : Last a -> Maybe a
// lastToMaybe : (a -> Last b) -> a -> Maybe b
function lastToMaybe(last) {
  if(isFunction(last)) {
    return function(x) {
      const m = last(x)

      if(!isSameType(Last, m)) {
        throw new TypeError('lastToMaybe: Last returning function required')
      }

      return applyTransform(m)
    }
  }

  if(isSameType(Last, last)) {
    return applyTransform(last)
  }

  throw new TypeError('lastToMaybe: Last or Last returning function required')
}

export default curry(lastToMaybe)
