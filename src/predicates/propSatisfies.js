/** @license ISC License (c) copyright 2018 original and current authors */
/** @author Ian Hofmann-Hicks (evilsoft) */

import curry from '../core/curry'
import isEmpty from '../core/isEmpty'
import isInteger from '../core/isInteger'
import isNil from '../core/isNil'
import isPredOrFunc from '../core/isPredOrFunc'
import isString from '../core/isString'
import predOrFunc from '../core/predOrFunc'

// propSatisfies: (String | Integer) -> (a -> Boolean) -> b -> Boolean
// propSatisfies: (String | Integer) -> Pred a -> b -> Boolean
function propSatisfies(key, pred, x) {
  if(!(isString(key) && !isEmpty(key) || isInteger(key))) {
    throw new TypeError(
      'propSatisfies: Non-empty String or Integer required for first argument'
    )
  }

  if(!isPredOrFunc(pred)) {
    throw new TypeError(
      'propSatisfies: Pred or predicate function required for second argument'
    )
  }

  return isNil(x) ? false : !!predOrFunc(pred, x[key])
}

export default curry(propSatisfies)
