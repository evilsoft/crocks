/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import First from './index.js'
import types from '../core/types.js'
const Either = types.proxy('Either')

import curry from '../core/curry.js'
import isFunction from '../core/isFunction.js'
import isSameType from '../core/isSameType.js'

const applyTransform = either =>
  either.either(First.empty, First)

// eitherToFirst : Either b a -> First a
// eitherToFirst : (a -> Either c b) -> a -> First b
function eitherToFirst(either) {
  if(isFunction(either)) {
    return function(x) {
      const m = either(x)

      if(!isSameType(Either, m)) {
        throw new TypeError('eitherToFirst: Either returning function required')
      }

      return applyTransform(m)
    }
  }

  if(isSameType(Either, either)) {
    return applyTransform(either)
  }

  throw new TypeError('eitherToFirst: Either or Either returning function required')
}

export default curry(eitherToFirst)
