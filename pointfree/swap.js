/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../funcs/curry')
const isFunction = require('../internal/isFunction')

function swap(f, g, m) {
  if(!isFunction(f) || !isFunction(g)) {
    throw new TypeError('swap: Function required for first two arguments')
  }
  else if(!isFunction(m.swap)) {
    throw new TypeError('swap: Either or Pair required for third arguments')
  }

  return m.swap(f, g)
}

module.exports = curry(swap)
