/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import curry from '../core/curry'
import isArray from '../core/isArray'
import isPredOrFunc from '../core/isPredOrFunc'
import isFunction from '../core/isFunction'
import isObject from '../core/isObject'
import object from '../core/object'
import predOrFunc from '../core/predOrFunc'

const not =
  fn => x => !fn(x)

// reject : Foldable f => (a -> Boolean) -> f a -> f a
function reject(pred, m) {
  if(!isPredOrFunc(pred)) {
    throw new TypeError(
      'reject: Pred or predicate function required for first argument'
    )
  }

  const fn =
    x => predOrFunc(pred, x)

  if(m && isFunction(m.reject)) {
    return m.reject(fn)
  }

  if(isArray(m)) {
    return m.filter(not(fn))
  }

  if(isObject(m)) {
    return object.filter(not(fn), m)
  }

  throw new TypeError('reject: Foldable or Object required for second argument')
}

export default curry(reject)
