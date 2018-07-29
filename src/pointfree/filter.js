/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import curry from '../core/curry'

import isFunction from '../core/isFunction'
import isPredOrFunc from '../core/isPredOrFunc'
import isObject from '../core/isObject'
import object from '../core/object'
import predOrFunc from '../core/predOrFunc'

// filter : Filterable f => (a -> Boolean) -> f a -> f a
function filter(pred, m) {
  if(!isPredOrFunc(pred)) {
    throw new TypeError('filter: Pred or predicate function required for first argument')
  }

  const fn =
    x => predOrFunc(pred, x)

  if(m && isFunction(m.filter)) {
    return m.filter(fn)
  }

  if(m && isObject(m)) {
    return object.filter(fn, m)
  }

  throw new TypeError('filter: Filterable or Object required for second argument')
}

export default curry(filter)
