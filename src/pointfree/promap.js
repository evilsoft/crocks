/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import compose from '../core/compose'
import curry from '../core/curry'
import fl from '../core/flNames'
import isFunction from '../core/isFunction'
import isProfunctor from '../core/isProfunctor'

function promap(l, r, m) {
  if(!(isFunction(l) && isFunction(r))) {
    throw new TypeError(
      'promap: Functions required for first two arguments'
    )
  }

  if(isFunction(m)) {
    return compose(compose(r, m), l)
  }

  if(isProfunctor(m)) {
    return (m[fl.promap] || m.promap).call(m, l, r)
  }

  throw new TypeError(
    'promap: Function or Profunctor required for third argument'
  )
}

export default curry(promap)
