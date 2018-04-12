/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

import compose from '../core/compose.js'
import curry from '../core/curry.js'
import isFunction from '../core/isFunction.js'

// contramap : Functor f => (b -> a) -> f b -> f a
function contramap(fn, m) {
  if(!isFunction(fn)) {
    throw new TypeError(
      'contramap: Function required for first argument'
    )
  }

  if(isFunction(m)) {
    return compose(m, fn)
  }

  if(m && isFunction(m.contramap)) {
    return m.contramap(fn)
  }
  throw new TypeError(
    'contramap: Function or Contavariant Functor of the same type required for second argument'
  )
}

export default curry(contramap)
