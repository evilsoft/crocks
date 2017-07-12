/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../core/curry')
const isFoldable = require('../core/isFoldable')
const isFunction = require('../core/isFunction')

function reduce(fn, init, m) {
  if(!isFunction(fn)) {
    throw new TypeError('reduce: Function required for first argument')
  }
  else if(!(isFoldable(m))) {
    throw new TypeError('reduce: Foldable required for third argument')
  }

  return m.reduce(fn, init)
}

module.exports = curry(reduce)
