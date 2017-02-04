/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../helpers/curry')

const isSemigroup = require('../predicates/isSemigroup')
const isString = require('../predicates/isString')

function concat(x, m) {
  if(!isSemigroup(m)) {
    throw new TypeError('concat: Semigroup required for second argument')
  }

  if(isString(m)) {
    return m + x
  }

  return m.concat(x)
}

module.exports = curry(concat)
