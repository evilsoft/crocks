/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import compose from '../core/compose'
import curry from '../core/curry'
import isArray from '../core/isArray'
import isObject from '../core/isObject'
import isFunction from '../core/isFunction'
import isFunctor from '../core/isFunctor'

import { map as arrayMap } from '../core/array'
import { map as objectMap } from '../core/object'

import fl from '../core/flNames'

// map : Functor f => (a -> b) -> f a -> f b
function map(fn, m) {
  if(!isFunction(fn)) {
    throw new TypeError('map: Function required for first argument')
  }

  if(isFunction(m)) {
    return compose(fn, m)
  }

  if(isArray(m)) {
    return arrayMap(fn, m)
  }

  if(m && isFunctor(m)) {
    return (m[fl.map] || m.map).call(m, fn)
  }

  if(isObject(m)) {
    return objectMap(fn, m)
  }

  throw new TypeError('map: Object, Function or Functor of the same type required for second argument')
}

export default curry(map)
