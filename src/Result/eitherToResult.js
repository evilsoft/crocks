/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import Result from './index.js'
import types from '../core/types.js'
const Either = types.proxy('Either')

import curry from '../core/curry.js'
import isFunction from '../core/isFunction.js'
import isSameType from '../core/isSameType.js'

const applyTransform = either =>
  either.either(Result.Err, Result.Ok)

// eitherToResult : Either e a -> Result e a
// eitherToResult : (a -> Either e b) -> a -> Result e b
function eitherToResult(either) {
  if(isFunction(either)) {
    return function(x) {
      const m = either(x)

      if(!isSameType(Either, m)) {
        throw new TypeError('eitherToResult: Either returning function required')
      }

      return applyTransform(m)
    }
  }

  if(isSameType(Either, either)) {
    return applyTransform(either)
  }

  throw new TypeError('eitherToResult: Either or Either returning function required')
}

export default curry(eitherToResult)
