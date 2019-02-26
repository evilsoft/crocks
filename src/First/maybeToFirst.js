/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import First from './index'
import { proxy } from '../core/types'
const Maybe = proxy('Maybe')

import curry from '../core/curry'
import isFunction from '../core/isFunction'
import isSameType from '../core/isSameType'

const applyTransform = maybe =>
  First(maybe)

// maybeToFirst : Maybe a -> First a
// maybeToFirst : (a -> Maybe b) -> a -> First b
function maybeToFirst(maybe) {
  if(isFunction(maybe)) {
    return function(x) {
      const m = maybe(x)

      if(!isSameType(Maybe, m)) {
        throw new TypeError('maybeToFirst: Maybe returning function required')
      }

      return applyTransform(m)
    }
  }

  if(isSameType(Maybe, maybe)) {
    return applyTransform(maybe)
  }

  throw new TypeError('maybeToFirst: Maybe or Maybe returning function required')
}

export default curry(maybeToFirst)
