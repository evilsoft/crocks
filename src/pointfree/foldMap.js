/** @license ISC License (c) copyright 2018 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const _array = require('../core/array')

const curry = require('../core/curry')
const isArray = require('../core/isArray')
const isFunction = require('../core/isFunction')

/** foldMap :: Foldable f, Semigroup s => (a -> s) -> f a -> s */
function foldMap(fn, m) {
  if(!isFunction(fn)) {
    throw new TypeError(
      'foldMap: Function returning Semigroups of the same type required for first argument'
    )
  }

  if(isArray(m)) {
    return _array.foldMap(fn, m)
  }

  if(m && isFunction(m.foldMap)) {
    return m.foldMap(fn)
  }

  throw new TypeError(
    'foldMap: Non-empty Foldable with at least one Semigroup required for second argument'
  )
}

module.exports = curry(foldMap)
