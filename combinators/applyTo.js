/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../helpers/curry')
const isFunction = require('../internal/isFunction')

// Applicator
// applyTo :: (a -> b) -> a -> b
function applyTo(fn, x) {
  if(!isFunction(fn)) {
    throw new TypeError('applyTo: Function required for first argument')
  }

  return fn(x)
}

module.exports = curry(applyTo)
