/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import isFunction from './isFunction.js'

function type(x) {
  if(x) {
    if(isFunction(x.type)) {
      return x.type()
    }
  }
  return {}.toString.call(x).slice(8, -1)
}

export default type
