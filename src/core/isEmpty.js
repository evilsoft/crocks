/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import isObject from './isObject.js'

function isEmpty(x) {
  if(isObject(x)) {
    return !Object.keys(x).length
  }

  if(x && x.length !== undefined) {
    return !x.length
  }

  return true
}

export default isEmpty
