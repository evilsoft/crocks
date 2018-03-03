/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isArray = require('../core/isArray')
const isEmpty = require('../core/isEmpty')
const isFunction = require('../core/isFunction')
const isSameType = require('../core/isSameType')
const isSemigroup = require('../core/isSemigroup')

// fold : Foldable f, Semigroup s => f s -> s
function fold(m) {
  if(m && isFunction(m.fold)) {
    return m.fold()
  }

  if(isArray(m)) {
    if(isEmpty(m)) {
      throw new TypeError('fold: Non-empty Foldable with at least one Semigroup is required')
    }

    if(m.length === 1) {
      if(!isSemigroup(m[0])) {
        throw new TypeError('fold: Foldable must contain Semigroups of the same type')
      }

      return m[0]
    }

    return m.reduce(function(x, y) {
      if(!(isSemigroup(x) && isSameType(x, y))) {
        throw new TypeError('fold: Foldable must contain Semigroups of the same type')
      }
      return x.concat(y)
    })
  }

  throw new TypeError('fold: Non-empty Foldable with at least one Semigroup is required')
}

module.exports = fold
