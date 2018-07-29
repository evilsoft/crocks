/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import curry from '../core/curry'
import isObject from '../core/isObject'
import isFunction from '../core/isFunction'
import isNil from '../core/isNil'

// applyMap :: ({ (* -> *) }, Object) -> (Object , String) -> Object
const applyMap = (fns, obj) =>
  function(acc, key) {
    if(isNil(fns[key])) {
      return Object.assign({}, acc, { [key]: obj[key] })
    }

    if(isObject(fns[key])) {
      return Object.assign({}, acc, {
        [key]: isObject(obj[key]) ? mapProps(fns[key], obj[key]) : obj[key]
      })
    }

    if(!isFunction(fns[key])) {
      throw new TypeError('mapProps: Object of functions required for first argument')
    }

    return Object.assign({}, acc, {
      [key]: fns[key](obj[key])
    })
  }

// mapProps :: { (* -> *) } -> Object -> Object
function mapProps(fns, obj) {
  if(!(isObject(fns) && isObject(obj))) {
    throw new TypeError('mapProps: Objects required for both arguments')
  }

  return Object.keys(obj)
    .reduce(applyMap(fns, obj), {})
}

export default curry(mapProps)
