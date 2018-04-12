/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Karthik Iyengar (karthikiyengar) */
/** @author Ian Hofmann-Hicks */

import curry from '../core/curry.js'
import equals from '../core/equals.js'
import isArray from '../core/isArray.js'
import isDefined from '../core/isDefined.js'
const isEmpty  = require('../core/isEmpty')
import isInteger from '../core/isInteger.js'
import isNil from '../core/isNil.js'
import isString from '../core/isString.js'

// propPathEq :: [ String | Number ] -> a -> Object -> Boolean
function propPathEq(keys, value, target) {
  if(!isArray(keys)) {
    throw new TypeError(
      'propPathEq: Array of Non-empty Strings or Integers required for first argument'
    )
  }

  if(isNil(target)) {
    return false
  }

  let acc = target
  for(let i = 0; i < keys.length; i++) {
    const key = keys[i]

    if(!(isString(key) && !isEmpty(key) || isInteger(key))) {
      throw new TypeError(
        'propPathEq: Array of Non-empty Strings or Integers required for first argument'
      )
    }

    if(isNil(acc)) {
      return false
    }

    acc = acc[key]

    if(!isDefined(acc)) {
      return false
    }
  }

  return equals(acc, value)
}

export default curry(propPathEq)
