/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import Result from './index'
import { proxy } from '../core/types'
const Last = proxy('Last')

import curry from '../core/curry'
import isFunction from '../core/isFunction'
import isSameType from '../core/isSameType'

const constant = x => () => x

const applyTransform = (left, last) =>
  last.valueOf().either(
    constant(Result.Err(left)),
    Result.Ok
  )

// lastToResult : c -> Last a -> Result c a
// lastToResult : c -> (a -> Last b) -> a -> Result c b
function lastToResult(left, last) {
  if(isFunction(last)) {
    return function(x) {
      const m = last(x)

      if(!isSameType(Last, m)) {
        throw new TypeError('lastToResult: Last returning function required for second argument')
      }

      return applyTransform(left, m)
    }
  }

  if(isSameType(Last, last)) {
    return applyTransform(left, last)
  }

  throw new TypeError('lastToResult: Last or Last returning function required for second argument')
}

export default curry(lastToResult)
