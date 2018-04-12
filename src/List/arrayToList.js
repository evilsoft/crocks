/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import List from './index.js'

import curry from '../core/curry.js'
import isArray from '../core/isArray.js'
import isFunction from '../core/isFunction.js'

// arrayToList : [ a ] -> List a
// arrayToList : (a -> [ b ]) -> a -> List b
function arrayToList(array) {
  if(isArray(array)) {
    return List.fromArray(array)
  }
  else if(isFunction(array)) {
    return function(x) {
      const g = array(x)

      if(!isArray(g)) {
        throw new TypeError('arrayToList: Array returning function required')
      }

      return List.fromArray(g)
    }
  }

  throw new TypeError('arrayToList: Array or Array returning function required')
}

export default curry(arrayToList)
