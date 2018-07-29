/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import { Err, Ok } from '.'
import curry from '../core/curry'
import isFunction from '../core/isFunction'

function tryCatch(fn) {
  if(!isFunction(fn)) {
    throw new TypeError('tryCatch: Function required for first argument')
  }

  const safe = function() {
    try { return Ok(fn.apply(this, arguments)) }
    catch(e) { return Err(e) }
  }

  Object.defineProperty(safe, 'length', { value: fn.length })

  return safe
}

export default curry(tryCatch)
