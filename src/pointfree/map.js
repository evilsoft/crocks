/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import array from '../core/array.js'
import compose from '../core/compose.js'
import curry from '../core/curry.js'
import isArray from '../core/isArray.js'
import isObject from '../core/isObject.js'
import isFunction from '../core/isFunction.js'
import object from '../core/object.js'

// map : Functor f => (a -> b) -> f a -> f b
function map(fn, m) {
  if(!isFunction(fn)) {
    throw new TypeError('map: Function required for first argument')
  }

  if(isFunction(m)) {
    return compose(fn, m)
  }

  if(isArray(m)) {
    return array.map(fn, m)
  }

  if(m && isFunction(m.map)) {
    return m.map(fn)
  }

  if(isObject(m)) {
    return object.map(fn, m)
  }

  throw new TypeError('map: Object, Function or Functor of the same type required for second argument')
}

export default curry(map)
