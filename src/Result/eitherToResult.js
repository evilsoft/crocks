/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import Result from './index'
import { proxy } from '../core/types'

import curry from '../core/curry'
import isFunction from '../core/isFunction'
import isSameType from '../core/isSameType'

const Either = proxy('Either')

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
