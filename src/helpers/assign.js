/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import curry from '../core/curry.js'
import isObject from '../core/isObject.js'
import object from '../core/object.js'

// assign : Object -> Object -> Object
function assign(x, m) {
  if(!(isObject(x) && isObject(m))) {
    throw new TypeError('assign: Objects required for both arguments')
  }

  return object.assign(x, m)
}

export default curry(assign)
