/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import isFunction from '../core/isFunction'
import _once from '../core/once'

// once : ((*) -> b) -> ((*) -> b)
export default function once(fn) {
  if(!isFunction(fn)) {
    throw new TypeError('once: Function required')
  }

  return _once(fn)
}
