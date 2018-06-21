/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../core/curry')
const isBifunctor = require('../core/isBifunctor')
const isFunction = require('../core/isFunction')
const fl = require('../core/flNames')

function bimap(f, g, m) {
  if(!(isFunction(f) &&  isFunction(g))) {
    throw new TypeError(
      'bimap: Functions required for first two arguments'
    )
  }

  if(!isBifunctor(m)) {
    throw new TypeError(
      'bimap: Bifunctor required for third argument'
    )
  }

  return (m[fl.bimap] || m.bimap).call(m, f, g)
}

module.exports = curry(bimap)
