/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../funcs/curry')
const isString = require('../internal/isString')
const isFunction = require('../internal/isFunction')
const isSemigroup = require('../internal/isSemigroup')

function concat(x, m) {
  if(!isSemigroup(m)) {
    throw new TypeError('concat: Semi-group required for second arg')
  }

  if(isString(m)) {
    return m + x
  }

  return m.concat(x)
}

module.exports = curry(concat)
