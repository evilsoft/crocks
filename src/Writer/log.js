/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import isFunction from '../core/isFunction.js'

function log(m) {
  if(!(m && isFunction(m.log))) {
    throw new TypeError('log: Writer required')
  }

  return m.log()
}

export default log
