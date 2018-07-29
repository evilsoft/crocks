/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Henrique Limas */
/** @author Ian Hofmann-Hicks */

import curry from '../core/curry'
import isDefined from '../core/isDefined'
import isEmpty from '../core/isEmpty'
import isNil from '../core/isNil'
import isInteger from '../core/isInteger'
import isString from '../core/isString'

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
