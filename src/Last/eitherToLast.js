/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import Last from './index.js'
import types from '../core/types.js'
const Either = types.proxy('Either')

import curry from '../core/curry.js'
import isFunction from '../core/isFunction.js'
import isSameType from '../core/isSameType.js'

const applyTransform = either =>
  either.either(Last.empty, Last)

// eitherToLast : Either b a -> Last a
// eitherToLast : (a -> Either c b) -> a -> Last b
function eitherToLast(either) {
  if(isFunction(either)) {
    return function(x) {
      const m = either(x)

      if(!isSameType(Either, m)) {
        throw new TypeError('eitherToLast: Either returning function required')
      }

      return applyTransform(m)
    }
  }

  if(isSameType(Either, either)) {
    return applyTransform(either)
  }

  throw new TypeError('eitherToLast: Either or Either returning function required')
}

export default curry(eitherToLast)
