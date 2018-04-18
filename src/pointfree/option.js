/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import curry from '../core/curry.js'
import isFunction from '../core/isFunction.js'

function option(x, m) {
  if(!(m && isFunction(m.option))) {
    throw new TypeError('option: Last argument must be a Maybe')
  }

  return m.option(x)
}

export default curry(option)
