/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import isFunction from '../core/isFunction.js'
import _once from '../core/once.js'

// once : ((*) -> b) -> ((*) -> b)
function once(fn) {
  if(!isFunction(fn)) {
    throw new TypeError('once: Function required')
  }

  return _once(fn)
}

export default once
