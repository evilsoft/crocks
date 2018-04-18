/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const { Nothing, Just } = require('../core/Maybe')

import curry from '../core/curry.js'
import isArray from '../core/isArray.js'
import isDefined from '../core/isDefined.js'
import isEmpty from '../core/isEmpty.js'
import isInteger from '../core/isInteger.js'
import isNil from '../core/isNil.js'
import isString from '../core/isString.js'

// propPath : [ String | Integer ] -> a -> Maybe b
function propPath(keys, target) {
  if(!isArray(keys)) {
    throw new TypeError('propPath: Array of Non-empty Strings or Integers required for first argument')
  }

  if(isNil(target)) {
    return Nothing()
  }

  let value = target
  for(let i = 0; i < keys.length; i++) {
    const key = keys[i]

    if(!(isString(key) && !isEmpty(key) || isInteger(key))) {
      throw new TypeError('propPath: Array of Non-empty Strings or Integers required for first argument')
    }

    if(isNil(value)) {
      return Nothing()
    }

    value = value[key]

    if(!isDefined(value)) {
      return Nothing()
    }
  }

  return Just(value)
}

export default curry(propPath)
