/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import curry from '../core/curry'
import isString from '../core/isString'

// objOf : String -> a -> Object
function objOf(key, value) {
  if(!(key && isString(key))) {
    throw new TypeError('objOf: Non-empty String required for first argument')
  }

  return { [key]: value }
}

export default curry(objOf)
