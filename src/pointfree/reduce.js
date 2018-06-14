/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../core/curry')
const isFoldable = require('../core/isFoldable')
const isFunction = require('../core/isFunction')
const fl = require('../core/flNames')

function reduce(fn, init, m) {
  if(!isFunction(fn)) {
    throw new TypeError(
      'reduce: Function required for first argument'
    )
  }

  if(!isFoldable(m)) {
    throw new TypeError(
      'reduce: Foldable required for third argument'
    )
  }

  return (m[fl.reduce] || m.reduce).bind(m)(fn, init)
}

module.exports = curry(reduce)
