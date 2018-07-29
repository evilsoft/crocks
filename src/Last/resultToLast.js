/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import Last from './index'
import { proxy } from '../core/types'

import curry from '../core/curry'
import isFunction from '../core/isFunction'
import isSameType from '../core/isSameType'

const Result = proxy('Result')

const applyTransform = result =>
  result.either(Last.empty, Last)

// resultToLast : Result b a -> Last a
// resultToLast : (a -> Result c b) -> a -> Last b
function resultToLast(result) {
  if(isFunction(result)) {
    return function(x) {
      const m = result(x)

      if(!isSameType(Result, m)) {
        throw new TypeError('resultToLast: Result returning function required')
      }

      return applyTransform(m)
    }
  }

  if(isSameType(Result, result)) {
    return applyTransform(result)
  }

  throw new TypeError('resultToLast: Result or Result returning function required')
}

export default curry(resultToLast)
