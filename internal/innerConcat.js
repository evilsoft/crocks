/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../helpers/curry')
const isSameType = require('../predicates/isSameType')
const isSemigroup = require('../predicates/isSemigroup')

function innerConcat(type, m) {
  const t = type.type()

  return function(left) {
    if(!isSemigroup(left)) {
      throw new TypeError(`${t}.concat: Both containers must contain Semigroups of the same type`)
    }

    return m.map(right => {
      if(!isSameType(left, right)) {
        throw new TypeError(`${t}.concat: Both containers must contain Semigroups of the same type`)
      }

      return left.concat(right)
    })
  }
}

module.exports = curry(innerConcat)
