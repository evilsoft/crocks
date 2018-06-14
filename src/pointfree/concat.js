/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../core/curry')
const isSameType = require('../core/isSameType')
const isSemigroup = require('../core/isSemigroup')
const fl = require('../core/flNames')

function concat(x, m) {
  if(!(isSemigroup(m) && isSameType(x, m))) {
    throw new TypeError(
      'concat: Semigroups of the same type required for both arguments'
    )
  }

  return (m[fl.concat] || m.concat).call(m, x)
}

module.exports = curry(concat)
