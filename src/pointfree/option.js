/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import curry from '../core/curry'
import isFunction from '../core/isFunction'

function option(x, m) {
  if(!(m && isFunction(m.option))) {
    throw new TypeError('option: Last argument must be a Maybe, First or Last')
  }

  return m.option(x)
}

export default curry(option)
