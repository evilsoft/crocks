/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import List from './index.js'

import curry from '../core/curry.js'
import isFunction from '../core/isFunction.js'
import isSameType from '../core/isSameType.js'

// listToArray : List a -> [ a ]
// listToArray : (a -> List b) -> a -> [ b ]
function listToArray(list) {
  if(isFunction(list)) {
    return function(x) {
      const m = list(x)

      if(!isSameType(List, m)) {
        throw new TypeError('listToArray: List returning function required')
      }

      return m.toArray()
    }
  }

  if(isSameType(List, list)) {
    return list.toArray()
  }

  throw new TypeError('listToArray: List or List returning function required')
}

export default curry(listToArray)
