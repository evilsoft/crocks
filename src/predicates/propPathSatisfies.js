/** @license ISC License (c) copyright 2018 original and current authors */
/** @author Ian Hofmann-Hicks (evilsoft) */

import curry from '../core/curry'
import isArray from '../core/isArray'
import isEmpty from '../core/isEmpty'
import isInteger from '../core/isInteger'
import isNil from '../core/isNil'
import isPredOrFunc from '../core/isPredOrFunc'
import isString from '../core/isString'
import predOrFunc from '../core/predOrFunc'

// propPathSatisfies: [ (String | Integer) ] -> (a -> Boolean) -> b -> Boolean
// propPathSatisfies: [ (String | Integer) ] -> Pred a -> b -> Boolean
function propPathSatisfies(keys, pred, x) {
  if(!isArray(keys)) {
    throw new TypeError(
      'propPathSatisfies: Array of Non-empty Strings or Integers required for first argument'
    )
  }

  if(!isPredOrFunc(pred)) {
    throw new TypeError(
      'propPathSatisfies: Pred or predicate function required for second argument'
    )
  }

  if(isNil(x)) {
    return false
  }

  let target = x
  for(let i = 0; i < keys.length; i++) {
    const key = keys[i]

    if(!(isString(key) && !isEmpty(key) || isInteger(key))) {
      throw new TypeError(
        'propPathSatisfies: Array of Non-empty Strings or Integers required for first argument'
      )
    }

    if(isNil(target)) {
      return false
    }

    target = target[key]
  }

  return !!predOrFunc(pred, target)
}

export default curry(propPathSatisfies)
