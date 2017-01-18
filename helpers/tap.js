/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction = require('../predicates/isFunction')

const curry = require('./curry')
const composeB = require('../combinators/composeB')
const constant = require('../combinators/constant')

// tap : (a -> b) -> a -> a
function tap(fn, x) {
  if(!isFunction(fn)) {
    throw new TypeError('tap: Function required for first argument')
  }

  return composeB(constant(x), fn, x)
}

module.exports = curry(tap)
