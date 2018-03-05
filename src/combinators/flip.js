/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../core/curry')
const isFunction = require('../core/isFunction')

// Flip (Cardinal)
//  flip :: (a -> b -> c) -> b -> a -> c
function flip(f, x, y) {
  if(!isFunction(f)) {
    throw new TypeError(
      'flip: Function required for first argument'
    )
  }

  return curry(f)(y, x)
}

module.exports = curry(flip)
