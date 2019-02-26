/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import Maybe from './index'
import { proxy } from '../core/types'
const Result = proxy('Result')

import curry from '../core/curry'
import isFunction from '../core/isFunction'
import isSameType from '../core/isSameType'

const applyTransform = result =>
  result.either(Maybe.Nothing, Maybe.Just)

// resultToMaybe : Result b a -> Maybe a
// resultToMaybe : (a -> Result c b) -> a -> Maybe b
function resultToMaybe(result) {
  if(isFunction(result)) {
    return function(x) {
      const m = result(x)

      if(!isSameType(Result, m)) {
        throw new TypeError('resultToMaybe: Result returning function required')
      }

      return applyTransform(m)
    }
  }

  if(isSameType(Result, result)) {
    return applyTransform(result)
  }

  throw new TypeError('resultToMaybe: Result or Result returning function required')
}

export default curry(resultToMaybe)
