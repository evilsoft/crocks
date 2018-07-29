/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import isFunction from '../core/isFunction'

export default function read(m) {
  if(!(m && isFunction(m.read))) {
    throw new TypeError('read: Writer required')
  }

  return m.read()
}
