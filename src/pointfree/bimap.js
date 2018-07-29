/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import curry from '../core/curry'
import isBifunctor from '../core/isBifunctor'
import isFunction from '../core/isFunction'
import fl from '../core/flNames'

function bimap(f, g, m) {
  if(!(isFunction(f) &&  isFunction(g))) {
    throw new TypeError(
      'bimap: Functions required for first two arguments'
    )
  }

  if(!isBifunctor(m)) {
    throw new TypeError(
      'bimap: Bifunctor required for third argument'
    )
  }

  return (m[fl.bimap] || m.bimap).call(m, f, g)
}

export default curry(bimap)
