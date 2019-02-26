/** @license ISC License (c) copyright 2018 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import curry from '../core/curry'
import isArray from '../core/isArray'
import isInteger from '../core/isInteger'
import isObject from '../core/isObject'
import isString from '../core/isString'

import { set } from '../core/array'
import { set as _set } from '../core/object'

function fn(name) {
  function setProp(key, val, x) {
    if(isObject(x)) {
      if(isString(key)) {
        return _set(key, val, x)
      }

      throw new TypeError(
        `${name}: String required for first argument when third argument is an Object`
      )
    }

    if(isArray(x)) {
      if(isInteger(key) && key >= 0) {
        return set(key, val, x)
      }

      throw new TypeError(
        `${name}: Positive Integer required for first argument when third argument is an Array`
      )
    }

    throw new TypeError(
      `${name}: Object or Array required for third argument`
    )
  }

  return curry(setProp)
}

// setProp :: (String | Integer) -> a -> (Object | Array) -> (Object | Array)
const setProp =
  fn('setProp')

export const origFn = fn

setProp.origFn = fn

export default setProp
