/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const _array = require('../core/array')

const isArray = require('../core/isArray')
const isFunction = require('../core/isFunction')

// fold : Foldable f, Semigroup s => f s -> s
function fold(m) {
  if(isArray(m)) {
    return _array.fold(m)
  }

  if(m && isFunction(m.fold)) {
    return m.fold()
  }

  throw new TypeError('fold: Non-empty Foldable with at least one Semigroup is required')
}

module.exports = fold
