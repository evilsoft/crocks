/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import Last from './index.js'
import types from '../core/types.js'
const Maybe = types.proxy('Maybe')

import curry from '../core/curry.js'
import isFunction from '../core/isFunction.js'
import isSameType from '../core/isSameType.js'

const applyTransform = maybe =>
  Last(maybe)

// maybeToLast : Maybe a -> Last a
// maybeToLast : (a -> Maybe b) -> a -> Last b
function maybeToLast(maybe) {
  if(isFunction(maybe)) {
    return function(x) {
      const m = maybe(x)

      if(!isSameType(Maybe, m)) {
        throw new TypeError('maybeToLast: Maybe returning function required')
      }

      return applyTransform(m)
    }
  }

  if(isSameType(Maybe, maybe)) {
    return applyTransform(maybe)
  }

  throw new TypeError('maybeToLast: Maybe or Maybe returning function required')
}

export default curry(maybeToLast)
