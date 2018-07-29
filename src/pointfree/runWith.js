/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import curry from '../core/curry'
import isFunction from '../core/isFunction'

function runWith(x, m) {
  if(!(m && isFunction(m.runWith))) {
    throw new TypeError('runWith: Arrow, Endo, Pred, Reader, Star or State required for second argument')
  }

  return m.runWith(x)
}

export default curry(runWith)
