/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import Last from './index'
import { proxy } from '../core/types'

import curry from '../core/curry'
import isFunction from '../core/isFunction'
import isSameType from '../core/isSameType'

const First = proxy('First')

const applyTransform = first =>
  Last(first.valueOf())

// firstToLast : First a -> Last a
// firstToLast : (a -> First b) -> a -> Last b
function firstToLast(first) {
  if(isFunction(first)) {
    return function(x) {
      const m = first(x)

      if(!isSameType(First, m)) {
        throw new TypeError('firstToLast: First returning function required')
      }

      return applyTransform(m)
    }
  }

  if(isSameType(First, first)) {
    return applyTransform(first)
  }

  throw new TypeError('firstToLast: First or First returning function required')
}

export default curry(firstToLast)
