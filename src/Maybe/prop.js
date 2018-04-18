/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import curry from '../core/curry.js'
import isDefined from '../core/isDefined.js'
import isEmpty from '../core/isEmpty.js'
import isNil from '../core/isNil.js'
import isInteger from '../core/isInteger.js'
import isString from '../core/isString.js'
const { Nothing, Just } = require('../core/Maybe')

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
