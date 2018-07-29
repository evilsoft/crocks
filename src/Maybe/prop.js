/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import curry from '../core/curry'
import isDefined from '../core/isDefined'
import isEmpty from '../core/isEmpty'
import isNil from '../core/isNil'
import isInteger from '../core/isInteger'
import isString from '../core/isString'
import Maybe from '../core/Maybe'
const { Nothing, Just } = Maybe

// prop : (String | Integer) -> a -> Maybe b
function prop(key, target) {
  if(!(isString(key) && !isEmpty(key) || isInteger(key))) {
    throw new TypeError('prop: Non-empty String or Integer required for first argument')
  }

  if(isNil(target)) {
    return Nothing()
  }

  const value = target[key]

  return isDefined(value)
    ? Just(value)
    : Nothing()
}

export default curry(prop)
