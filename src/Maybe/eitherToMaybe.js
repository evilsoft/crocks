/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import Maybe from './index.js'
import types from '../core/types.js'
const Either = types.proxy('Either')

import curry from '../core/curry.js'
import isFunction from '../core/isFunction.js'
import isSameType from '../core/isSameType.js'

const applyTransform = either =>
  either.either(Maybe.Nothing, Maybe.Just)

// eitherToMaybe : Either b a -> Maybe a
// eitherToMaybe : (a -> Either c b) -> a -> Maybe b
function eitherToMaybe(either) {
  if(isFunction(either)) {
    return function(x) {
      const m = either(x)

      if(!isSameType(Either, m)) {
        throw new TypeError('eitherToMaybe: Either returning function required')
      }

      return applyTransform(m)
    }
  }

  if(isSameType(Either, either)) {
    return applyTransform(either)
  }

  throw new TypeError('eitherToMaybe: Either or Either returning function required')
}

export default curry(eitherToMaybe)
