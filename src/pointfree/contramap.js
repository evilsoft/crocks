/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const compose = require('../core/compose')
const curry = require('../core/curry')
const isFunction = require('../core/isFunction')

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

module.exports = curry(contramap)
