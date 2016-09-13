/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../funcs/curry')
const isFunction = require('../internal/isFunction')

function reduce(fn, init, m) {
  if(!isFunction(fn)) {
    throw new TypeError('reduce: Function required for first arg')
  }
  else if(!(m && isFunction(m.reduce))) {
    throw new TypeError('reduce: Foldable required for third arg')
  }

  return m.reduce(fn, init)
}

module.exports = curry(reduce)
