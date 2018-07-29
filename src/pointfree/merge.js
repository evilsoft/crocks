/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import curry from '../core/curry'
import isFunction from '../core/isFunction'

function merge(fn, m) {
  if(!isFunction(fn)) {
    throw new TypeError('merge: Function required for first argument')
  }

  if(!(m && isFunction(m.merge))) {
    throw new TypeError('merge: Pair or Tuple required for second argument')
  }

  return m.merge(fn)
}

export default curry(merge)
