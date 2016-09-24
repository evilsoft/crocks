/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../funcs/curry')
const isFunction = require('../internal/isFunction')

function bimap(f, g, m) {
  if(!isFunction(f) || !isFunction(g)) {
    throw new TypeError('bimap: Function required for first two arguments')
  }
  else if(!isFunction(m.bimap)) {
    throw new TypeError('bimap: Bifunctor required for third argument')
  }

  return m.bimap(f, g)
}

module.exports = curry(bimap)
