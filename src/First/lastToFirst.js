/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import First from './index.js'
import types from '../core/types.js'
const Last = types.proxy('Last')

import curry from '../core/curry.js'
import isFunction from '../core/isFunction.js'
import isSameType from '../core/isSameType.js'

const applyTransform = last =>
  First(last.valueOf())

// lastToFirst : Last a -> First a
// lastToFirst : (a -> Last b) -> a -> First b
function lastToFirst(last) {
  if(isFunction(last)) {
    return function(x) {
      const m = last(x)

      if(!isSameType(Last, m)) {
        throw new TypeError('lastToFirst: Last returning function required')
      }

      return applyTransform(m)
    }
  }

  if(isSameType(Last, last)) {
    return applyTransform(last)
  }

  throw new TypeError('lastToFirst: Last or Last returning function required')
}

export default curry(lastToFirst)
