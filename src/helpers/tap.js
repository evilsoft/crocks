/** @license ISC License (c) copyright 2017 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const curry = require('../core/curry')
const compose = require('../core/compose')
const isFunction = require('../core/isFunction')

const constant = x => () => x

/** tap :: (a -> b) -> a -> a */
function tap(fn, x) {
  if(!isFunction(fn)) {
    throw new TypeError(
      'tap: Function required for first argument'
    )
  }

  return compose(constant(x), fn)(x)
}

module.exports = curry(tap)
