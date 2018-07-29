/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import Either from './index'
import types from '../core/types'
const Result = types.proxy('Result')

import curry from '../core/curry'
import isFunction from '../core/isFunction'
import isSameType from '../core/isSameType'

const applyTransform = result =>
  result.either(Either.Left, Either.Right)

// resultToEither : Result e a -> Either e a
// resultToEither : (a -> Result e b) -> a -> Either e b
function resultToEither(result) {
  if(isFunction(result)) {
    return function(x) {
      const m = result(x)

      if(!isSameType(Result, m)) {
        throw new TypeError('resultToEither: Result returning function required')
      }

      return applyTransform(m)
    }
  }

  if(isSameType(Result, result)) {
    return applyTransform(result)
  }

  throw new TypeError('resultToEither: Result or Result returning function required')
}

export default curry(resultToEither)
