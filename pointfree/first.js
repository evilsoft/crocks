/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../funcs/curry')
const isFunction = require('../internal/isFunction')

function first(fn, m) {
  if(!isFunction(fn)) {
    throw new TypeError('first: Function required for first argument')
  }

  if(!(m && isFunction(m.first))) {
    throw new TypeError('first: Arrow of the same type required for second argument')
  }

  return m.first(fn)
}

module.exports = curry(first)
