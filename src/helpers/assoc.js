/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import curry from '../core/curry.js'
import isObject from '../core/isObject.js'
import isString from '../core/isString.js'
import object from '../core/object.js'

// assoc : String -> a -> Object -> Object
function assoc(key, val, obj) {
  if(!isString(key)) {
    throw new TypeError('assoc: String required for first argument')
  }

  if(!isObject(obj)) {
    throw new TypeError('assoc: Object required for third argument')
  }
  return object.assign({ [key]: val }, obj)
}

export default curry(assoc)
