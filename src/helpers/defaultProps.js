/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import curry from '../core/curry'
import isObject from '../core/isObject'
import object from '../core/object'

// defaultProps : Object -> Object -> Object
function defaultProps(x, m) {
  if(!isObject(x) || !isObject(m)) {
    throw new TypeError('defaultProps: Objects required for both arguments')
  }

  return object.assign(m, x)
}

export default curry(defaultProps)
