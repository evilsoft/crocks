/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Henrique Limas */
/** @author Ian Hofmann-Hicks */

import curry from '../core/curry.js'
import isDefined from '../core/isDefined.js'
import isEmpty from '../core/isEmpty.js'
import isNil from '../core/isNil.js'
import isInteger from '../core/isInteger.js'
import isString from '../core/isString.js'

// propOr : a -> String | Integer -> b -> c
function propOr(def, key, target) {
  if(!(isString(key) && !isEmpty(key) || isInteger(key))) {
    throw new TypeError('propOr: Non-empty String or Integer required for second argument')
  }

  if(isNil(target)) {
    return def
  }

  const value = target[key]

  return isDefined(value)
    ? value
    : def
}

export default curry(propOr)
