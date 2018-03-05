/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */


const curry = require('../core/curry')
const isSameType = require('../core/isSameType')
const isSemigroup = require('../core/isSemigroup')
const isString = require('../core/isString')

function concat(x, m) {
  if(!(isSemigroup(m) && isSameType(x, m))) {
    throw new TypeError(
      'concat: Semigroups of the same type required both arguments'
    )
  }

  if(isString(m)) {
    return m + x
  }

  return m.concat(x)
}

module.exports = curry(concat)
