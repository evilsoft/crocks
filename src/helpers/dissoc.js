/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import curry from '../core/curry'
import isString from '../core/isString'
import isObject  from '../core/isObject'

function applyDissoc(key, obj) {
  return function(acc, k) {
    if(obj[k] !== undefined && k !== key) {
      acc[k] = obj[k]
    }
    return acc
  }
}

// dissoc : String -> Object -> Object
function dissoc(key, obj) {
  if(!isString(key)) {
    throw new TypeError('dissoc: String required for first argument')
  }

  if(!isObject(obj)) {
    throw new TypeError('dissoc: Object required for second argument')
  }

  return Object.keys(obj).reduce(applyDissoc(key, obj), {})
}

export default curry(dissoc)
