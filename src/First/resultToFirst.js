/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import First from './index.js'
import types from '../core/types.js'
const Result = types.proxy('Result')

import curry from '../core/curry.js'
import isFunction from '../core/isFunction.js'
import isSameType from '../core/isSameType.js'

const applyTransform = result =>
  result.either(First.empty, First)

// resultToFirst : Result b a -> First a
// resultToFirst : (a -> Result c b) -> a -> First b
function resultToFirst(result) {
  if(isFunction(result)) {
    return function(x) {
      const m = result(x)

      if(!isSameType(Result, m)) {
        throw new TypeError('resultToFirst: Result returning function required')
      }

      return applyTransform(m)
    }
  }

  if(isSameType(Result, result)) {
    return applyTransform(result)
  }

  throw new TypeError('resultToFirst: Result or Result returning function required')
}

export default curry(resultToFirst)
