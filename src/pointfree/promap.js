/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import compose from '../core/compose.js'
import curry from '../core/curry.js'
import isFunction from '../core/isFunction.js'

function promap(l, r, m) {
  if(!(isFunction(l) && isFunction(r))) {
    throw new TypeError(
      'promap: Functions required for first two arguments'
    )
  }

  if(isFunction(m)) {
    return compose(compose(r, m), l)
  }

  if(m && isFunction(m.promap)) {
    return m.promap(l, r)
  }

  throw new TypeError(
    'promap: Function or Profunctor required for third argument'
  )
}

export default curry(promap)
