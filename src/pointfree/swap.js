/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../core/curry')
const isFunction = require('../core/isFunction')

function swap(f, g, m) {
  if(!(isFunction(f) && isFunction(g))) {
    throw new TypeError(
      'swap: Function required for first two arguments'
    )
  }

  if(m && isFunction(m.swap)) {
    return m.swap(f, g)
  }

  throw new TypeError(
    'swap: Async, Either, Pair or Result required for third arguments'
  )
}

module.exports = curry(swap)
