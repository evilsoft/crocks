/** @license ISC License (c) copyright 2018 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import curry from '../core/curry'
import isArray from '../core/isArray'
import isEmpty from '../core/isEmpty'
import isInteger from '../core/isInteger'
import isObject from '../core/isObject'
import isString from '../core/isString'

import { unset, set } from '../core/array'
import { unset as _unset, set as _set } from '../core/object'

const pathError =
  'unsetPath: Non-empty Array of non-empty Strings and/or Positive Integers required for first argument'

// unsetPath :: [ String | Integer ] -> a -> a
function unsetPath(path, obj) {
  if(!isArray(path) || isEmpty(path)) {
    throw new TypeError(pathError)
  }

  if(!(isObject(obj) || isArray(obj))) {
    return obj
  }

  const key = path[0]

  if(!(isString(key) && !isEmpty(key) || isInteger(key) && key >= 0)) {
    throw new TypeError(pathError)
  }

  if(path.length === 1) {
    if(isArray(obj) && isInteger(key)) {
      return unset(key, obj)
    }

    if(isObject(obj) && isString(key)) {
      return _unset(key, obj)
    }

    return obj
  }

  const next =
    obj[key]

  if(!(isObject(next) || isArray(next))) {
    return obj
  }

  if(isArray(obj)) {
    return set(key, unsetPath(path.slice(1), next), obj)
  }

  return _set(key, unsetPath(path.slice(1), next), obj)
}

export default curry(unsetPath)
