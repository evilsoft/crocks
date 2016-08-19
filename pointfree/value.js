/** @license ISC License (c) copyright 2016 original and current authors */
/** @author Ian Hofmann-Hicks (evil) */

const isFunction = require('../internal/isFunction')

function value(m) {
  if(!(m && isFunction(m.value))) {
    throw new TypeError('value: Either, Identity, List, Pair, Writer or Monoid required')
  }

  return m.value()
}

module.exports = value
