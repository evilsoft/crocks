/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import Async from './index'
import types from '../core/types'
const Either = types.proxy('Either')

import curry from '../core/curry'
import isFunction from '../core/isFunction'
import isSameType from '../core/isSameType'

const applyTransform = either =>
  either.either(Async.Rejected, Async.Resolved)

// eitherToAsync : Either e a -> Async e a
// eitherToAsync : (a -> Either e b) -> a -> Async e b
function eitherToAsync(either) {
  if(isFunction(either)) {
    return function(x) {
      const m = either(x)

      if(!isSameType(Either, m)) {
        throw new TypeError('eitherToAsync: Either returning function required')
      }

      return applyTransform(m)
    }
  }

  if(isSameType(Either, either)) {
    return applyTransform(either)
  }

  throw new TypeError('eitherToAsync: Either or Either returning function required')
}

export default curry(eitherToAsync)
